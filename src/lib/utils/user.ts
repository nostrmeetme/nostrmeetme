// import ndk from '$lib/stores/ndk';
// import { writable } from 'svelte/store';
import NDK, { NDKUser } from '@nostr-dev-kit/ndk';


export async function createNDKUserFrom(idtype:string,userid:string,ndk:NDK){
    let user:NDKUser | undefined = undefined;
    let pubkey:string | undefined = undefined;
    let npub:string | undefined = undefined;
    let nip05:string | undefined = undefined;
    let doValidateNip05 = false;
    let validatePass = true;
    switch (idtype) {
    case 'nip05':
        // load nip05
        nip05 = userid;
        const { username, domain } = parseNip05(userid);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const nostrJson = await fetch(`https://${domain}/.well-known/nostr.json?${currentTimestamp}`) //{ mode: 'no-cors' }
        .then(r => r.json())
        .catch(() => console.log("fetching nip05 failed"));
        // const response = await fetch(`https://${domain}/.well-known/nostr.json?${currentTimestamp}`,fetchopts);
        // const nostrJson = await response.json();
        pubkey = nostrJson.names[username];
        user = new NDKUser({'pubkey':pubkey});
        doValidateNip05 = true;
        // user = new NDKUser({pubkey:pubkey});
        // user.ndk = ndk;
        break;

    case 'npub':
        // load npub
        npub = userid;
        user = new NDKUser({'npub':npub});
        // user = new NDKUser({npub:npub});
        break;

    case 'pubkey':
        //load pubkey
        pubkey = userid;
        // user = ndk.getUser({pubkey:pubkey});
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
            // if(doValidateNip05) validatePass = profile?.nip05 == nip05 ? true : false;
            if(user && profile) user.profile = profile;
        });
    }
    return user;
    // return validatePass ? user : undefined;
}

export function parseNip05(slug:string) {
    if (slug.match(/@/)) {
        const [username, domain ] = slug.split('@');
        return {username, domain};
    } else {
        return { username: '_', domain: slug };
    }
}
