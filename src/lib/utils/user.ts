// import ndk from '$lib/stores/ndk';
// import { writable } from 'svelte/store';
import NDK, { NDKUser } from '@nostr-dev-kit/ndk';
// import { user } from "$lib/stores/user";

export const NIP05 = 'nip05';
export const NPUB = 'npub';
export const PUBKEY = 'pubkey';
export type PubidTypes = 'nip05' | 'npub' | 'pubkey';
export let ndk:NDK;

export const PUBID = {
    NIP05 : 'nip05',
    NPUB : 'npub',
    PUBKEY: 'pubkey'
}

/** 
 * NostrUser extends NDKUser:
 * - may be instantiated from any pubid (pubkey, nbup, ni05)
 * - loads kind0 profile upon insttiation
 * - verifies kind0 profile exists on nostr
 * - nip05 is a class level property (rather than only in profile)
 */

// export class NostrUser extends NDKUser {


//     public constructor(opts: NDKUserParams) {
//         if (opts.npub) this._npub = opts.npub;

//         if (opts.hexpubkey) this._pubkey = opts.hexpubkey;
//         if (opts.pubkey) this._pubkey = opts.pubkey;

//         if (opts.relayUrls) {
//             this.relayUrls = opts.relayUrls;
//         }
//         super(opts);
//     }

// }

export async function confirmUser(user: NDKUser|undefined, pubid: string|undefined=undefined, idtype: PubidTypes|undefined=undefined){
    let ismatch:boolean = false;
    let logmsg : string;
    // instantiate user and load profile
    if(!!idtype && !!pubid){
        if(!!user){
            ismatch = userHasPubid(user,pubid,idtype);
            // user.set(ismatch ? user : undefined);
        }
        if(!ismatch || user == undefined){
            user = await createNDKUserFrom(pubid,idtype)
                .then(u => {
                    if(u == undefined) {
                        // TODO throw error
                        logmsg = "User ["+pubid+"] cannot be found on Nostr.";
                        if(idtype == NIP05){
                            let { username, domain } = parseNip05(pubid);
                            logmsg = "The nip05 name ["+username+"] cannot be found at domain ["+domain+"]. Try again using your npub."
                        }
                        console.log(logmsg);
                    }
                    return u
                });
        }            
    }
}


export async function createNDKUserFrom(userid:string,idtype:PubidTypes|undefined,ndk?:NDK){
    console.log('createNDKUserFrom()');
    let user :NDKUser | undefined = undefined;
    let pubkey :string | undefined = undefined;
    let npub :string | undefined = undefined;
    let nip05 :string | undefined = undefined;
    switch (idtype) {
    case NIP05:
        // load nip05
        nip05 = userid;
        user =  await NDKUser.fromNip05(nip05);
        // const { username, domain } = parseNip05(userid);
        // const nostrJson = await fetch(`https://${domain}/.well-known/nostr.json?name=${username}`) //{ mode: 'no-cors' }
        // .then(r => r.json())
        // .catch(() => console.log("fetching nip05 failed"));
        // pubkey = nostrJson.names[username];
        // user = pubkey ? new NDKUser({'pubkey':pubkey}) : undefined;
        break;

    case NPUB:
        // load npub
        npub = userid;
        user = new NDKUser({'npub':npub});
        console.log('loaded user');
        break;

    case PUBKEY:
        //load pubkey
        pubkey = userid;
        user = new NDKUser({'pubkey':pubkey});
        break;
    default:
        console.log('idtype is not defined for loading user from pubid');
        break;
    }
    // ndk
    if(user){
        console.log('fetching user profile')
        user.ndk = ndk || new NDK;
        await user.fetchProfile()
        .catch(()=> console.log('user.fetchProfile() failed'))
        .then((profile)=> {
            console.log('user.fetchProfile() complete');
            if(user && profile) user.profile = profile;
        });
        console.log('user name from profile :'+ user.profile?.name)
    }
    if(!user) {
        console.log('user ID not found or not instantiated');
    }
    return user;
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

export function pubidIsType(pubid:string|undefined = undefined, pubidType:PubidTypes|undefined = undefined):PubidTypes | undefined{
    let isType:PubidTypes|undefined;
    if(pubid){
        // https://masteringjs.io/tutorials/fundamentals/email-regex
        const nip05Regex = /^(?:[a-z0-9+!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
        const npubRegex = /^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/;
        const pubkeyRegex = /^[0-9a-fA-F]{64}$/;
        if((pubidType == NIP05 || undefined ) && nip05Regex.test(pubid)) isType = NIP05;
        if((pubidType == NPUB || undefined ) && npubRegex.test(pubid)) isType = NPUB;
        if((pubidType == PUBKEY || undefined ) && pubkeyRegex.test(pubid)) isType = PUBKEY;
    }
    return isType;
}

export function userHasPubid(user:NDKUser,pubid:string,idtype:PubidTypes|undefined){
    let ismatch: boolean = false;
    if(!!user.profile){
        if((idtype == NIP05 || undefined) && pubid == user.profile.nip05) ismatch = true;
        if((idtype == NPUB || undefined) && pubid == user.npub) ismatch = true;
        if((idtype == PUBKEY || undefined) && pubid == user.pubkey) ismatch = true;
    }
    return ismatch;
}