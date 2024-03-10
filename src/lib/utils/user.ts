import { writable, get, type Writable, type Readable, type Unsubscriber } from 'svelte/store';
import NDK, { NDKUser, type NDKSigner, type NDKUserProfile, type NDKConstructorParams, NDKNip07Signer, NDKNip46Signer, NDKPrivateKeySigner, serializeProfile} from '@nostr-dev-kit/ndk';
import { init as initNostrLogin, type NostrLoginOptions} from "nostr-login"
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { InviteOptions } from './invite';
import { NostrJson } from './NostrJson';
// import { NostrJson } from './s3api';

export const NIP05_DOMAIN = 'nostrmeet.me';
export const USERNAME = 'username';
export const NIP05 = 'nip05';
export const NPUB = 'npub';
export const PUBKEY = 'pubkey';
export type UseridTypes = 'username' | 'nip05' | 'npub' | 'pubkey';

export const SECUSER = 'secuser';
export const PUBUSER = 'pubuser';
export type UserType = 'secuser' | 'pubuser';
export type UserList =  {[SECUSER]?:string,[PUBUSER]?:string};

// nsec types used for storing locally.
export const NSEC = 'nsec';
export const ENCRYPTED_NSEC = 'xnsec';
export type NsecType = 'nsec | xnsec';


/** 
 * - manages login, logout, and loading profiles
 * - allows switching between pubusers accounts without logging out secuser
 * - pubuser may be instantiated from any userid (pubkey, npub, nip05)
 * - secuser may be logged in via nip07 browser extension OR nip46 nsec bunker
 * - verifies existance of and loads kind0 profile upon user insttiation
 * - sets ndk.activeuser
 */
export class Auth{
    private static _ndk: Writable<NDK | undefined> = writable();
    private static _pubuser: Writable<NDKUser | undefined> = writable();
    private static _secuser: Writable<NDKUser | undefined> = writable();
    private static _password: string;
    private static _signer: NDKSigner;
    private static _useLocalNsec = false;

    // connect NDK singleton upon instantiation
    static get ndk(){return Auth._ndk}
    // get current pubuser, or secuser for public tasks
    static get pubuser(){return get(Auth._pubuser) ? Auth._pubuser : Auth._secuser}
    // get only secuser for secure tasks
    static get secuser(){return Auth._secuser}
    // get() wrapper for obtaining raw values from readable stores
    static clone(prop: Writable<any>|Readable<any>){return get(prop)}
    
    // quick access to see if pubuser or secuser is logged in.
    static pubkeys :UserList;

    // stash unsubscribers for NDKUser.ndk
    private static unsubPubuserNDK:Unsubscriber|undefined;
    private static unsubSecuserNDK:Unsubscriber|undefined;

    /**
     * main method to login and load profile for pubuser or/and secuser
     * usage: 
     * - login() : login all users from storage (reset existing sessions)
     * - login(false) : login all users from storage (DONOT reset existing sessions)
     * - login(true) : login secuser from nip07 signer (request auth and unset pubuser)
     * - login(signer) : login secuser from provided signer (EG: after generating a new nsec)
     * - login(userid) : login pubuser from param (login secuser from storage if unset)
     * - login({pubuser:userid}) : same as above
     * - login({secuser:userid}) : login secuser from param (logout pubuser)
     * - login({pubuser:userid, secuser:userid}) : login all users from params
     */
    static async login(login?:UserList | string | boolean | NDKSigner, password?:string, redirect:string|boolean = false){
        console.log('login called');
        // if(!browser) return;
        let user:NDKUser|undefined;
        let stored = Auth.getStores();
        let secuser = get(Auth._secuser);
        let pubuser = get(Auth._pubuser);
        let signer = implementsNDKSigner(login);

        await Auth.loadNDK();

        if(!login){
            console.log('loging in user sessions from storage');
            try{
                // login users from storage
                if(login === false){
                    // DONOT reset existing sessions
                    if(stored[PUBUSER] == pubuser?.pubkey) stored[PUBUSER] = undefined;
                    if(stored[SECUSER] == secuser?.pubkey) stored[SECUSER] = undefined;
                }
                await Auth.loginPubuser(await Auth.newUser(stored[PUBUSER]));
                await Auth.loginSecuser(await Auth.newUser(stored[SECUSER]));
            }catch{
                console.log('unable to login user from storage : login()')
            }
        } 
        else
        if(login === true || !!signer){
            console.log('loging in user via nip07 signer');
            // login secuser from signer and unset pubuser
            Auth._signer = signer ? signer : await Auth.newSigner();
            await Auth.loginSecuser(await Auth._signer.user(), true);
        } 
        else
        if(typeof(login) == 'string'){
            console.log('loging in user from passed userid');
            // login pubuser from param 
            await Auth.loginPubuser(await Auth.newUser(login));
            try{
                if(stored[SECUSER] && (stored[SECUSER] != secuser?.pubkey)){
                    // login secuser from storage
                    await Auth.loginSecuser(await Auth.newUser(stored[SECUSER]));
                };
            }catch{
                console.log('no secuser found in storage')
            }
        } 
        else
        if(!signer && typeof(login) == 'object'){
            console.log('loging in user from passed data');
            login = login as UserList;
            if(!!login[PUBUSER]){
                // login pubuser from value 
                await Auth.loginPubuser(await Auth.newUser(login[PUBUSER]));
                if(!login[SECUSER]){
                    // login secuser from storage
                    await Auth.loginSecuser(await Auth.newUser(stored[SECUSER]));
                }
            }
            if(!!login[SECUSER]){
                // login secuser from value (logout pubuser if no value given)
                await Auth.loginSecuser(await Auth.newUser(login[SECUSER]), !login[PUBUSER]);
            }
        }
        // console.log('failed to login user');
        if(redirect) Auth.loginRedirect(redirect);
        return;
    }

    private static loginRedirect(redirect:string|true){
        if(redirect === true){
            let loggedin = get(Auth.pubuser);
            if(loggedin) {
                let {username, domain} = parseNip05(loggedin.profile?.nip05);
                redirect = domain == NIP05_DOMAIN ? '/'+username 
                : !!loggedin.profile?.nip05 ? '/'+loggedin.profile.nip05 
                : '/'+loggedin.npub;
            }
        }
        if(typeof(redirect) == 'string') goto(redirect);
    }

    private static async loginPubuser(user?:NDKUser){
        if(!user) return;
        let pubuser = get(Auth._pubuser);
        if(!pubuser || (pubuser.pubkey !== user.pubkey)){
            console.log('loging in new pubuser');
            await Auth.loadUserProfile(user);
            // if no profile found on nostr, do not log in user.
            if(!user.profile){
                console.log('pubuser not logged in : no profile on nostr');
                return;
            }
            Auth.setActiveUser(user);
            Auth._pubuser.set(user)
            Auth.store(PUBUSER)
        }
        return Auth._pubuser;
    }

    private static async loginSecuser(user?:NDKUser, resetPubuser = false){
        if(!user) return;
        let secuser = get(Auth._secuser);
        if(!secuser || (secuser.pubkey !== user.pubkey)){
            console.log('loging in new secuser');
            await Auth.loadUserProfile(user);
            Auth._secuser.set(user);
        }
        if(resetPubuser && Auth.pubkeys[PUBUSER]){
            Auth.setActiveUser(user);
            Auth.logoutPubuser();            
        }
        Auth.store();
        return Auth._secuser;
    }

    // TODO
    private static encryptNsec(nsec:string, password:string):string{
        let xnsec:string = nsec;
        return xnsec;
    }

    // TODO
    private static decryptNsec(xnsec:string, password:string):string{
        let nsec:string = xnsec;
        return nsec;
    }


    // logout
    static logout(asSecuser:boolean = false, redirect?:string){
        Auth.logoutPubuser();
        if(asSecuser) Auth.logoutSecuser();
        if(!get(Auth.secuser)){
            redirect = '/';
        }
        if(redirect) goto(redirect);
    }
    private static logoutPubuser(){
        Auth._pubuser.update(pubuser => {
            Auth.unstore(PUBUSER);
            return undefined;
        })
    }
    private static logoutSecuser(){
        Auth._secuser.update(secuser => {
            Auth.unstore(SECUSER);
            return undefined;
        })
    }

    static store(key?: UserType){
        if(!key || key == SECUSER) Auth.storeUser(Auth._secuser, SECUSER);
        if(!key || key == PUBUSER) Auth.storeUser(Auth._pubuser, PUBUSER);
    }
    static getStores(key?: UserType){
        let secuser, pubuser;
        if(browser) {
            if(!key || key == SECUSER)  secuser = window.localStorage.getItem(SECUSER) || undefined;
            if(!key || key == PUBUSER)  pubuser = window.localStorage.getItem(PUBUSER) || undefined;
            Auth.pubkeys = {secuser,pubuser}
        }else{
            console.log('local storage not available');
        }
        return Auth.pubkeys;
    }
    static unstore(key?: UserType){
        if(!key || key == SECUSER){
            Auth.pubkeys[SECUSER] = undefined;
            if(browser) window.localStorage.removeItem( SECUSER )
        }
        if(!key || key == PUBUSER) {
            Auth.pubkeys[PUBUSER] = undefined;
            if(browser) window.localStorage.removeItem( PUBUSER )
        }
    }
    private static storeUser(user: Writable<NDKUser | undefined>, key: UserType){
        let pubkey = get(user)?.pubkey;
        if(pubkey){ 
            Auth.pubkeys[key] = pubkey;
            if(!browser) return console.log('local storage not available');
            window.localStorage.setItem( key, pubkey )
        }
        // store user nsec or xnsec
        if(key == SECUSER){

        }
    }

    static async loadNDK(options:NDKConstructorParams = {}, asStaticProperty = true){
        let ndk:NDK | undefined;
        let config:NDKConstructorParams = {
            explicitRelayUrls: [
                // 'wss://purplepag.es',
                'wss://relay.nostr.band',
                'wss://nos.lol',
                'wss://relay.snort.social',
                'wss://relay.damus.io'
            ],
            debug: false    
        }
        try{
            Object.assign(config,options);
            ndk = new NDK(config);
            await ndk.connect()
                .then(() =>  console.log('ndk connected'));
        }catch{
            console.log('ndk FAILED to connect')
        }
        if(ndk && Auth._ndk && asStaticProperty) Auth._ndk.set(ndk);
        return ndk;
    }

    /**
     * 
     * @param userid : username, nip05, npub, pubkey
     * @param forLogin : if true : returns undefined if user is already logged in. 
     * @returns 
     */
    private static async newUser(userid?:string, forLogin=true){
        if(!userid) return undefined;
        let user :NDKUser | undefined = undefined;
        const idtype = useridIsType(userid);
        switch (idtype) {
        case NIP05:
            // load nip05
            if(!forLogin || userid != get(Auth.pubuser)?.profile?.nip05){
                console.log('new user instantiated from nip05');
                user =  await NDKUser.fromNip05(userid);
            }
            break;
        case NPUB:
            // load npub
            if(!forLogin || userid != get(Auth.pubuser)?.npub){
                console.log('new user instantiated from npub');
                user = new NDKUser({'npub':userid});
            }
            break;
        case PUBKEY:
            //load pubkey
            if(!forLogin || userid != get(Auth.pubuser)?.pubkey){
                console.log('new user instantiated from pubkey');
                user = new NDKUser({'pubkey':userid});
            }
            break;
        case USERNAME:
            // load nip05 from app domain
            let useridNip05 = userid+'@'+NIP05_DOMAIN;
            // TODO check existence of nip05 against NostrName cloud storage
            if(!forLogin || useridNip05 != get(Auth.pubuser)?.profile?.nip05){
                console.log('new user instantiated from username');
                user =  await NDKUser.fromNip05(useridNip05);
            }
            break        
        default:
            console.log('invalid userid for new user');
            return undefined;
        }
        if(!user) console.log('new user not instantiated (already logged in)');
        return user;
    }

    // store nsec locally OR using a NIP standard (07 or 46)
    // to store locally, pass true or a password string as parameter
    private static async newSigner(newPrivateKey = false){
        let ndksigner:NDKSigner;
        ndksigner = newPrivateKey ? NDKPrivateKeySigner.generate() : new NDKNip07Signer();
        Auth._ndk.update(ndk => {
            if(!!ndk) ndk.signer = ndksigner;
            return ndk;
        });
        return ndksigner; 
    }

    static useNostrLogin(use = true):NostrLoginOptions{
        if(use) Auth._useLocalNsec = false;
        return {
            theme:'purple',
            startScreen:'signup',
            // bunkers:'nostrmeet.me,nsec.app'
        }
    }

    // generate nsec
    // instantiate user from pubkey
    // (optional) save new kin0 event wih nip05
    // store nsec locally with (optional as xnsec) password encryption
    // login as new secuser and logout all other users
    // static async createAccount(profile?:NDKUserProfile, password?:string, storeLocal = true):Promise<NDKSigner>{
    //     const signer = NDKPrivateKeySigner.generate();
    //     profile.nip05 = registerNip05
    //     profile.name =  profile?.name || username;
    //     profile.displayName = profile?.displayName || profile.name || username;
    //     return signer;
    // }


    static async loadUserProfile(user:NDKUser){
        // subscribe user.ndk to Auth.ndk
        let unsubNDK = Auth._ndk.subscribe(ndk => {
            if(!!user){
                if(!!ndk) user.ndk = ndk;
            }else{
                // remove subscruiber when !user
                unsubNDK()
            }
        });
        // load user.profile
        // console.log('NDKUser.profile loaded : '+JSON.stringify(user.profile))
        return await user.fetchProfile() || undefined
    }

    private static setActiveUser(user:NDKUser){
        // set ndk.activeUser
        Auth._ndk.update(ndk => {
            if(ndk) ndk.activeUser = user;
            return ndk;
        });
    }

    static async loginFromDom(domEvent:Event) {
        domEvent.preventDefault();
        let userid = Auth.getDomEventValue(domEvent,'userid');
        console.log('login called from DOM event');
        Auth.login(userid);
    }
    static logoutFromDom(domEvent:Event) {
        domEvent.preventDefault();
        let secuser = !!Auth.getDomEventValue(domEvent,'secuser') ? true : false;
        console.log('logout called from DOM event')
        Auth.logout(secuser);
    }
    private static getDomEventValue(domEvent:Event, name:string){
        let value: string | undefined;
        if(domEvent instanceof FormDataEvent){
            value = domEvent.formData.get(name)?.toString() || undefined;
        }
        if(domEvent instanceof SubmitEvent){
            value = domEvent.submitter?.getAttribute(name) || undefined;
        }
        if(domEvent instanceof CustomEvent){
            value = domEvent.detail[name] || undefined;
        }
        return value;
    }
    static handlePubidInput(event:KeyboardEvent | MouseEvent, id:string){
        let submit = false;
        let elem = document.getElementById(id) as HTMLInputElement;
        if(event instanceof MouseEvent){
            submit = true;
        }
        if(event instanceof KeyboardEvent){
            let key = event.key;
            if(elem?.nodeName == 'INPUT'){
            // TODO auto suggest kind0 profiles from api.nostr.wine 
            if(key == "Enter" && !!elem.value) submit = true;
            }
        }
        if(submit) goto('/'+elem.value);
    }
}


export function parseNip05(slug: string|undefined = undefined) {
    if(!slug){
        return { username: '', domain: '' };
    }else if (slug.match(/@/)) {
        const [username, domain ] = slug.split('@');
        return {username, domain};
    } else {
        return { username: '_', domain: slug };
    }
}

export function useridIsType(userid:string|undefined = undefined, type:UseridTypes|undefined = undefined):UseridTypes | undefined{
    let isType:UseridTypes|undefined = undefined;
    if(userid){
        // https://www.regular-expressions.info/email.html
        const usernameregex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i
        const nip05Regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        const npubRegex = /^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/;
        const pubkeyRegex = /^[0-9a-fA-F]{64}$/;
        if(((type == NIP05 || (type == undefined && !isType))) && nip05Regex.test(userid)) isType = NIP05;
        if(((type == NPUB || (type == undefined && !isType))) && npubRegex.test(userid)) isType = NPUB;
        if(((type == PUBKEY || (type == undefined && !isType))) && pubkeyRegex.test(userid)) isType = PUBKEY;
        if(((type == USERNAME || (type == undefined && !isType))) && usernameregex.test(userid)) isType = USERNAME;
    }
    console.log('checking userid istype : "'+ userid +'" = '+isType);
    return isType;
}

export function userHasId(user:NDKUser,userid:string,idtype:UseridTypes|undefined){
    let ismatch: boolean = false;
    if(!!user.profile){
        if((idtype == NIP05 || undefined) && userid == user.profile.nip05) ismatch = true;
        if((idtype == NPUB || undefined) && userid == user.npub) ismatch = true;
        if((idtype == PUBKEY || undefined) && userid == user.pubkey) ismatch = true;
    }
    return ismatch;
}

export function implementsNDKSigner(signer:any){
    try{
        if(signer instanceof NDKPrivateKeySigner) return signer as NDKPrivateKeySigner;
        if(signer instanceof NDKNip46Signer) return signer as NDKNip46Signer;
        if(signer instanceof NDKNip07Signer) return signer as NDKNip07Signer;
    }catch{
    }
}

// TODO
export async function registerNip05(name:string, pubkey:string, relays?:string[]){
    // POST to api nostrmeet.me/api/nip05
    const response = await fetch('/api/nip05', {
        method: 'PUT',
        body: JSON.stringify({name,pubkey,relays}),
        headers: {'Content-Type': 'application/json'}
    });
    return NostrJson.parse(await response.json());
}

export function handleInputRegisterNip05(event:KeyboardEvent | MouseEvent, elemid:string, pubkey?:string, relays?:string[]){
    let submit = false;
    let elem = document.getElementById(elemid) as HTMLInputElement;
    if(event instanceof MouseEvent){
        submit = true;
    }
    if(event instanceof KeyboardEvent){
        let key = event.key;
        if(elem?.nodeName == 'INPUT'){
        if(key == "Enter" && !!elem.value) submit = true;
        }
    }
    if(submit && pubkey) registerNip05(elem.value, pubkey, relays);
}