import { NDKUser } from '@nostr-dev-kit/ndk';
import {env} from '$env/dynamic/public';
import { Auth } from './user';
/**
 *  invite URL format 
 * `/[INVITE]/[hash]?npub=[npub]&time=[timestamp]&[options]`
 */ 

export const INVITE = 'invite';

// = sha256 hash of the Invite object
export type InviteHash = string;

// search params for invite URLs
export class Invite {
    // time : number = 0; // timestamp when invite was created
    // npub : string = ''; // id of the inviting account 
    options ;
    isvalid = false;
    hash : string | undefined;
    private _advocate : NDKUser | undefined;


    /**
     * create an instance of invite object
     * - from options object when generating an invite (generates new valid hash)
     * - from URL `/invite/[hash]?[options]` of scanned invite code (stores hash for validating)
     * 
     * @param options 
     * @returns 
     */
    constructor(options:InviteOptions | URL | NDKUser){
        // let npub, time, invite;
        if(options instanceof NDKUser){
            this.options = new InviteOptions({npub:options.npub});
        }
        else
        if(options instanceof URL){
            let path = options.pathname.split('/');
            // require `/invite` at path root and `npub` in search params
            if(path[1] == INVITE && options.searchParams.get('npub')) {
                this.hash = path[2]
                this.options = new InviteOptions(options.searchParams);
            }
        }
        else
        if(options instanceof InviteOptions){
            this.options = new InviteOptions(options);
        }
        if(!(this as any).options) throw('invalid options for invite constructor')
        console.log('Invite constructed : '+JSON.stringify(this.toJSON()));
        return this;
    }

    // sgets the profile of the npub the invitation as advocate
    // if invitation is invalid, gets the default advocate account
    // sets advocate property and local storage for retrieval
    async getAdvocate(){
        if(this._advocate) return this._advocate;

        let advocate:NDKUser | undefined;
        await this.validateHash();
        if(this.isvalid){
          advocate = new NDKUser({'npub':this.options?.npub});
        }
        if(!advocate){
            await fetch('/api/nip05?name=advocate').then( r => 
                advocate = new NDKUser({'pubkey':(r.json() as any).names.advocate})
            )
        }
        if(advocate){
            await Auth.loadNDK();
            advocate.profile = await Auth.loadUserProfile(advocate);
            window.localStorage.setItem( 'advocate', advocate.pubkey);
        }
        this._advocate = advocate;
        return advocate;
    }
     
    async validateHash(){
        if (!this.options) throw('no options to validate')
        if (!this.hash) throw('no hash to validate')
        let validHash = await this.toHash();
        console.log('validating invite hash : ' + this.hash)
        console.log('against valid hash : ' + validHash)
        if (validHash == this.hash){
            this.isvalid = true;
            return true;
        }
        this.isvalid = false;
        return false;
    }

    // generates an invitecode and a valid URL fom Invite
    async toURL(baseurl:string = ''):Promise<string>{
        baseurl = !baseurl && env.PUBLIC_VITE_HOST ? 'http://'+env.PUBLIC_VITE_HOST+'/' : baseurl+'/'; 
        let invite = this.options;
        if (!invite) throw('canot convert empty invite to URL');
        console.log('Invite to Object : '+JSON.stringify(invite))
        let hash = '/' + (this.hash || await this.toHash());
        let urlparams = '';
        Object.entries(invite).forEach(([key, value]) => {
            if(!!value){
                urlparams = !!urlparams ? `${urlparams}&` : '/?';
                urlparams = urlparams + `${key}=${value}`;
            }
        });
        let url = baseurl + INVITE + hash + urlparams;
        return url;
    }

    private async toHash(): Promise<InviteHash> {
        let onlyvalidate = this.hash ? true : false;
        let normalized = {};
        let hash;
        if(!this.options) throw('cannot convert empty options to hash')
        try{
            Object.entries(this.options).forEach(([key, value]) => {
                if(!!value){
                    (normalized as any)[key] = value.toString();
                }
            });
        }catch{
            throw('cannot convert options to hash')
        }
        console.log('building hash from : '+JSON.stringify(normalized))
        const response = await fetch('/api/hash', {
                method: 'POST',
                body: JSON.stringify(normalized),
                headers: {'Content-Type': 'application/json'}
            });
        ({hash} = await response.json());
        if(!onlyvalidate) this.hash = hash;
        return hash;
    }

    toJSON(){
        return this.options;
    }
}


// optional URL params for invites
export class InviteOptions  { 
    npub : string = '';
    ts:number = Date.now();
    expires? : number = 0; // timestamp of when invite expires: 0 = no expiration
    limit? : number = 0; // TODO number of uses
    usenip46? :boolean = true ; // use bunker or TODO local storage for new account nsec
    test? : boolean = false; // do not send profile, follow list, or message events to relays
    nofollowback? : boolean = false;
    nowelcomemsg? : boolean = false;
    noannouncement? : boolean = false;

    constructor(options:object|InviteOptions|URLSearchParams){
        if(options instanceof URLSearchParams) 
            options = convertURLSearchParamsToObject(options);
        try{
            if(!Object.keys(options).includes('npub')) throw('no npub key')
            Object.assign(this,options)
            if(!this.npub) throw('no npub')
        }catch(e){
            throw('failed to instantiate InviteOptions : ' + e)
        }
    }
}


export class UserInviteOptions {
    authrequired? : boolean = false; // require secure login to generate invites from your account
    followback? : boolean = false; // follow new account upon creation (will follow you)
    welcomemsg? : string = ''; // DM sent to new user when account is created
    announcement? : string = ''; // note published to your timeline when new account is created
    defaultexpiry? : number = 0; // number of seconds before invites expire
    defaullimit? : number = 0; // default use limit : 0 = unlimited
}

function convertURLSearchParamsToObject(params:URLSearchParams){
    let object = {};
    params.forEach( (value, key) => {
        (object as any)[key] = value;
    });
    return object;
}


function convertFromString(value:string|undefined):boolean|number|string|undefined{
    if(!!value){
        try{
            if(value === 'true') return true;
            if(value === 'false') return false;
            if(typeof value != 'boolean') {
                let number = new Number(value).valueOf();
                return Number.isNaN(number) ? number : value.toString();
            }
        }catch{
            return undefined;
        }
    }
}

function convertToString(value:boolean|number|string|undefined):string|undefined{
    if(typeof value !== 'undefined'){
        try{
            if(typeof value !== 'boolean'){
                return value.toString();
            }else{
                return value ? 'true' : 'false';
            }
        }catch{
            return undefined;
        }    
    }
}
