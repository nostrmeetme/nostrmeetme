// import ndk from '$lib/stores/ndk';
// import { writable } from 'svelte/store';
import NDK, { NDKUser } from '@nostr-dev-kit/ndk';

export const NIP05 = 'nip05';
export const NPUB = 'npub';
export const PUBKEY = 'pubkey';
export type PubidTypes = 'nip05' | 'npub' | 'pubkey';

export async function createNDKUserFrom(userid:string,idtype:PubidTypes|undefined,ndk:NDK){
    console.log('createNDKUserFrom()');
    let user :NDKUser | undefined = undefined;
    let pubkey :string | undefined = undefined;
    let npub :string | undefined = undefined;
    let nip05 :string | undefined = undefined;
    switch (idtype) {
    case NIP05:
        // load nip05
        nip05 = userid;
        const { username, domain } = parseNip05(userid);
        // const currentTimestamp = Math.floor(Date.now() / 1000);
        const nostrJson = await fetch(`https://${domain}/.well-known/nostr.json?name=${username}`) //{ mode: 'no-cors' }
        .then(r => r.json())
        .catch(() => console.log("fetching nip05 failed"));
        pubkey = nostrJson.names[username];
        user = pubkey ? new NDKUser({'pubkey':pubkey}) : undefined;
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
        user.ndk = ndk;
        await user.fetchProfile()
        .catch(()=> console.log('user.fetchProfile() failed'))
        .then((profile)=> {
            console.log('user.fetchProfile() complete');
            if(user && profile) user.profile = profile;
        });
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