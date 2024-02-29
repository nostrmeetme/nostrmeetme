import { writable, get, type Writable, type Readable, type Unsubscriber } from 'svelte/store';
import NDK, { NDKUser, type NDKSigner, type NDKUserProfile, type NDKConstructorParams, NDKNip07Signer, NDKNip46Signer, NDKPrivateKeySigner, serializeProfile } from '@nostr-dev-kit/ndk';
import { init as initNostrLogin } from "nostr-login"
import { browser } from '$app/environment';
import { dateTomorrow } from './helpers';
import { goto } from '$app/navigation';

export const NIP05 = 'nip05';
export const NPUB = 'npub';
export const PUBKEY = 'pubkey';
export type UseridTypes = 'nip05' | 'npub' | 'pubkey';

export const SECUSER = 'secuser';
export const PUBUSER = 'pubuser';
export type UserType = 'secuser' | 'pubuser';
export type UserList =  {[SECUSER]?:string,[PUBUSER]?:string};


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
    // private static _useNip46 = false;

    // connect NDK singleton upon instantiation
    static get ndk(){return Auth._ndk}
    // get current pubuser, or secuser for public tasks
    static get pubuser(){return Auth._pubuser || Auth._secuser}
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
     * - login(true) : login secuser from signer (unset pubuser)
     * - login(userid) : login pubuser from param (login secuser from storage if unset)
     * - login({pubuser:userid}) : same as above
     * - login({secuser:userid}) : login secuser from param (logout pubuser)
     * - login({pubuser:userid, secuser:userid}) : login all users from params
     */
    static async login(login?:UserList | string | boolean){
        console.log('login called');
        // if(!browser) return;
        let user:NDKUser|undefined;
        const stored = Auth.getStores();
        const secuser = get(Auth._secuser);
        const pubuser = get(Auth._pubuser);

        await Auth.loadNDK();

        if(!login){
            // login users from storage
            if(login === false){
                // DONOT reset existing sessions
                if(stored[PUBUSER] == pubuser?.pubkey) stored[PUBUSER] = undefined;
                if(stored[SECUSER] == secuser?.pubkey) stored[SECUSER] = undefined;
            }
            await Auth.loginPubuser(await Auth.newUser(stored[PUBUSER]));
            await Auth.loginSecuser(await Auth.newUser(stored[SECUSER]));
        } 
        else
        if(login === true){
            // login secuser from signer and unset pubuser
            await Auth.loginSecuser(await Auth.newSignedUser(), true);
        } 
        else
        if(typeof(login) == 'string'){
            // login pubuser from param 
            await Auth.loginPubuser(await Auth.newUser(login));
            if(stored[SECUSER] && (stored[SECUSER] != secuser?.pubkey)){
                // login secuser from storage
                await Auth.loginSecuser(await Auth.newUser(stored[SECUSER]));
            };
        } 
        else
        if(typeof(login) == 'object'){
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
        return;
    }

    private static async loginPubuser(user?:NDKUser){
        if(!user) return;
        await Auth.loadUserProfile(user);
        // if no profile found on nostr, do not log in user.
        if(!user.profile){
            console.log('pubuser not logged in : no profile on nostr');
            return;
        }
        Auth.setActiveUser(user);
        Auth._pubuser.set(user)
        Auth.store(PUBUSER)
        return Auth._pubuser;
    }

    private static async loginSecuser(user?:NDKUser, resetPubuser = false){
        if(!user) return;
        await Auth.loadUserProfile(user);
        if(resetPubuser && Auth.pubkeys[PUBUSER]){
            Auth.setActiveUser(user);
            Auth.logoutPubuser();            
        }
        Auth._secuser.set(user);
        Auth.store();
        return Auth._pubuser;
    }

    // logout
    static logout(asSecuser:boolean = false, redirect?:string){
        Auth.logoutPubuser();
        if(asSecuser) Auth.logoutSecuser();
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
            if(browser) window.localStorage.unsetItem( SECUSER )
        }
        if(!key || key == PUBUSER) {
            Auth.pubkeys[PUBUSER] = undefined;
            if(browser) window.localStorage.unsetItem( PUBUSER )
        }
    }
    private static storeUser(user: Writable<NDKUser | undefined>, key: UserType){
        let pubkey = get(user)?.pubkey;
        if(pubkey){ 
            Auth.pubkeys[key] = pubkey;
            if(!browser) return console.log('local storage not available');
            window.localStorage.setItem( key, pubkey )
        }
    }

    static async loadNDK(options:NDKConstructorParams = {}){
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
        if(ndk && Auth._ndk) Auth._ndk.set(ndk);
        return Auth._ndk;
    }

    private static async newUser(userid?:UseridTypes|string){
        if(!userid) return undefined;
        let user :NDKUser | undefined = undefined;
        const idtype = useridIsType(userid);
        switch (idtype) {
        case NIP05:
            // load nip05
            user =  await NDKUser.fromNip05(userid);
            break;
        case NPUB:
            // load npub
            user = new NDKUser({'npub':userid});
            break;
        case PUBKEY:
            //load pubkey
            user = new NDKUser({'pubkey':userid});
            break;
        default:
            console.log('invalid userid for new user');
            return undefined;
        }
        return user;
    }

    private static async newSignedUser(){
        let ndksigner:NDKSigner;
        ndksigner = new NDKNip07Signer()
        Auth._ndk.update(ndk => {
            if(!!ndk) ndk.signer = ndksigner;
            return ndk;
        });
        return await ndksigner.user(); 
    }

    static useNip46(use = true){
        // Auth._useNip46 = true;
        initNostrLogin({
            theme:'purple',
            startScreen:'signup',
            bunkers:'nostrmeet.me,nsec.app'
        })
    }

    private static async loadUserProfile(user:NDKUser){
        // subscribe user.ndk to Auth.ndk
        let unsubNDK = Auth._ndk.subscribe(ndk => {
            if(!!user){
                if(!!ndk) user.ndk = ndk;
            }else{
                unsubNDK()
            }
        });
        // load user.profile
        await user.fetchProfile()
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
}



// export async function createNDKUserFrom(userid:string,idtype?:UseridTypes,ndk?:NDK){
//     console.log(`called createNDKUserFrom(${userid},${idtype},...)`);
//     let user :NDKUser | undefined = undefined;
//     let pubkey :string | undefined = undefined;
//     let npub :string | undefined = undefined;
//     let nip05 :string | undefined = undefined;
//     if(!idtype){
//         idtype = useridIsType(userid);
//     }
//     if(!ndk){
//         ndk = new NDK;
//         ndk.connect();
//     }
//     switch (idtype) {
//     case NIP05:
//         // load nip05
//         nip05 = userid;
//         try{
//             user =  await NDKUser.fromNip05(nip05);
//             console.log('loaded user from nip05')
//         }catch{
//             console.log('faild loading user from nip05')
//         }
//         break;
//     case NPUB:
//         // load npub
//         npub = userid;
//         user = new NDKUser({'npub':npub});
//         console.log('loaded user from npub');
//         break;

//     case PUBKEY:
//         //load pubkey
//         pubkey = userid;
//         user = new NDKUser({'pubkey':pubkey});
//         break;
//     default:
//         console.log('idtype is not defined for loading user from userid');
//         break;
//     }
//     console.log('instantiate user complete : '+user?.pubkey)
//     // ndk
//     if(user){
//         console.log('fetching user profile')
//         user.ndk = ndk;
//         await user.fetchProfile()
//         .catch(() => console.log('user.fetchProfile() failed'))
//         .then((response:any)=> {
//             console.log('user.fetchProfile() response : '+JSON.stringify(response));
//             // if(response) user.profile = response;
//         });
//         console.log('user name from profile :'+ user.profile?.name)
//     }
//     if(!user) {
//         console.log('user ID not found or not instantiated');
//         // throw 'user ID not found or not instantiated';
//     }
//     return user;
// }

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
    let isType:UseridTypes|undefined;
    if(userid){
        // https://masteringjs.io/tutorials/fundamentals/email-regex
        const nip05Regex = /^(?:[a-z0-9+!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
        const npubRegex = /^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/;
        const pubkeyRegex = /^[0-9a-fA-F]{64}$/;
        if((type == NIP05 || type == undefined ) && nip05Regex.test(userid)) isType = NIP05;
        if((type == NPUB || type == undefined ) && npubRegex.test(userid)) isType = NPUB;
        if((type == PUBKEY || type == undefined ) && pubkeyRegex.test(userid)) isType = PUBKEY;
    }
    console.log('checking userid istype : '+isType +' : '+userid);
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

