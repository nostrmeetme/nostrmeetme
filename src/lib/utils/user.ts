// import ndk from '$lib/stores/ndk';
// import { writable } from 'svelte/store';
import NDK, { NDKUser } from '@nostr-dev-kit/ndk';


export async function createNDKUserFrom(idtype:string,userid:string,ndk:NDK){
    let user:NDKUser | undefined = undefined;
    let pubkey:string | undefined = undefined;
    let npub:string | undefined = undefined;
    let nip05:string | undefined = undefined;
    switch (idtype) {
    case 'nip05':
        // load nip05
        nip05 = userid;
        const { username, domain } = parseNip05(userid);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const nostrJson = await fetch(`https://${domain}/.well-known/nostr.json?${currentTimestamp}`) //{ mode: 'no-cors' }
        .then(r => r.json())
        .catch(() => console.log("fetching nip05 failed"));
        pubkey = nostrJson.names[username];
        user = new NDKUser({'pubkey':pubkey});
        break;

    case 'npub':
        // load npub
        npub = userid;
        user = new NDKUser({'npub':npub});
        break;

    case 'pubkey':
        //load pubkey
        pubkey = userid;
        user = new NDKUser({'pubkey':pubkey});
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
    return user;
}

export function parseNip05(slug:string) {
    if (slug.match(/@/)) {
        const [username, domain ] = slug.split('@');
        return {username, domain};
    } else {
        return { username: '_', domain: slug };
    }
}

export function validateUserId(userid:string):string | boolean{
    let validIdType: string | boolean = false;
    // https://masteringjs.io/tutorials/fundamentals/email-regex
    const nip05VRegex = /^(?:[a-z0-9+!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
    const npubRegex = /^npub1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/;
    const pubkeyRegex = /^[0-9a-fA-F]{64}$/;
    validIdType = nip05VRegex.test(userid) ? 'nip05' 
        : npubRegex.test(userid) ? 'npub' 
        : pubkeyRegex.test(userid) ? 'pubkey' 
        : false;
    return validIdType;
}