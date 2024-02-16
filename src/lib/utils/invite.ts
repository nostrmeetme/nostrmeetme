import {unixTimeNowInSeconds} from '$lib/utils/helpers';
import { bytesToHex } from '@noble/hashes/utils'
import { sha256 } from '@noble/hashes/sha256'
import { utf8Encoder } from 'nostr-tools/utils'
import { NDKUser } from '@nostr-dev-kit/ndk';

/**
 *  invite URL format 
 * `/[INVITE]/[hash]?npub=[npub]&time=[timestamp]&[options]`
 */ 

export const INVITE = 'invite';

// = sha256 hash of the Invite object
export type InviteHash = string;

// search params for invite URLs
export class Invite {
    time : number = 0; // timestamp when invite was created
    npub : string = ''; // id of the inviting account 
    options : InviteOptions = {};
    validated = false;

    constructor(user?:NDKUser,options:InviteOptions = {}){
        let npub, time, invite;
        if(user){
            npub = user.npub || '';
            time = user.npub ? unixTimeNowInSeconds() : 0;
            invite = this.fromObject({npub,time,options});   
        }
        this.validated = invite ? true : false; 
        return this;
    }

    // generates an invitecode and a valid URL fom Invite
    toURL():URL{
        let hash = this.toHash();
        let flatten = this.toObject();
        let urlparams = '';
        Object.entries(flatten).forEach(([key, value]) => {
            if(!!value){
                urlparams = !!urlparams ? `${urlparams}&` : '?';
                urlparams = urlparams + `${key}=${value}`;
            }
        });
        return new URL(`/${INVITE}/${hash}?${urlparams}`);
    }

    fromURL(url:URL){
        let path = url.pathname.split('/');
        let testhash: string , validhash: string, invite;
        try{
            if(path[1] != INVITE || !url.searchParams) throw 'invalid URL';
            testhash = path[2];
            validhash = this.toHash(url.searchParams);
            if (testhash !== validhash) throw 'hash does not match invite';
            invite = this.fromObject(url.searchParams);
        }catch(error){
            console.log(`error getting invite from URL : `+error)
            return undefined; //TODO error
        }
        this.validated = invite ? true : false;
        return invite;
    }

    fromObject(obj:any){
        let invite = {options:new InviteOptions()};
        try{
            Object.entries(obj).forEach(([key, value]) => {
                if(!!value){
                    if(key == 'npub' || 'time'){
                        (invite as any)[key] = value;
                    }else if(key == 'options' && typeof value == 'object'){
                        Object.assign(invite.options, value);
                    }else{
                        (invite.options as any)[key] = value;
                    }
                }
            });
        }catch{
        }
        return this.validate(invite) ? Object.assign(this, invite) : undefined;
    }

    validate(invite?:any):boolean{
        if(!invite) invite = this;
        try{
            // TODO maybe need to validate npub user exists?
            if(typeof invite.npub !== 'string') throw 'invalid npub';
            // TODO validate time is a date in the future
            if(typeof invite.time !== 'number') throw 'invalid time';
            if(!invite.options) {
                invite.options = {};
            }else{
                if(typeof invite.options !== 'object') throw 'invalid options';
                const defaultoptions = (new InviteOptions() as any);
                Object.entries(invite.options).forEach(([key, value]) => {
                    if(key === 'npub' || 'time') throw 'invalid options:'+key;
                    if(typeof value !== defaultoptions[key]) throw 'invalid options:'+key;
                })
            }
        }catch(error){
            console.log(`could not validate invite : ${error}`)
            return false;
        }
        return true;
    }

    toHash(object?:object): InviteHash {
        let jsonthis = JSON.stringify(object || this);
        let salt = 'supersecretenvironmentvariable'; // TODO get ENV.salt
        let hashthis = sha256(utf8Encoder.encode(jsonthis+salt));
        return bytesToHex(hashthis);
    }

    toJSON(){
        return this.toObject();
    }

    toObject(){
        const required = {npub:this.npub, time:this.time};
        return {...required, ...this.options};
    }

}

// optional search params for invite URLs
export class InviteOptions  { 
    expires? : number = 0; // timestamp of when invite expires: 0 = no expiration
    limit? : number = 0; // TODO number of uses
    usenip46? :boolean = false ; // use bunker or local storage for new account nsec
    test? : boolean = false;
    nofollowback? : boolean = false;
    nowelcomemsg? : boolean = false;
    noannouncement? : boolean = false;
}


export class UserInviteOptions {
    authrequired? : boolean = false; // require secure login to generate invites from your account
    followback? : boolean = false; // follow new account upon creation (will follow you)
    welcomemsg? : string = ''; // DM sent to new user when account is created
    announcement? : string = ''; // note published to your timeline when new account is created
    defaultexpiry? : number = 0; // number of seconds before invites expire
    defaullimit? : number = 0; // default use limit : 0 = unlimited
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
