import type { Reroute } from '@sveltejs/kit';
import {useridIsType} from "$lib/utils/user";
// import type { Handle } from '@sveltejs/kit';

// TODO read from and write to nostr.json file 
export const ssr = false;

const wellKnownNames: Record<string, string> = {
    "advocate" : "eb5983bb8495fd9545e6187a9b91426c5357db84a113d5bca292bc3c18494549",
    "manime": "df67f9a7e41125745cbe7acfbdcd03691780c643df7bad70f5d2108f2d4fc200"
};

const staticRoutes = [ 'award', 'chat', 'invite', 'friends', 'apps'];

export const reroute: Reroute = ({ url }) => {
    let path = url.pathname.split('/');
    let reroute:string, pubid:string|undefined;
    if(!staticRoutes.includes(path[1]) ){
        // reroute 'name' from well-known/nostr.json to '/[pubid]'
        if (path[1] in wellKnownNames) {
            path[1] = wellKnownNames[path[1]]
        }

        // reroute '/[pubid]' to '/[idtype]/[pubid]' ?
        pubid = useridIsType(path[1])
        if(pubid){
            path[1] = pubid +'/'+ path[1];
        }
    }

    reroute = path.join('/');
    if(reroute != url.pathname) {
        console.log('hook "reroute" to : '+reroute)
    }

    return reroute;
}

