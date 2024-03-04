import type { Reroute } from '@sveltejs/kit';
import {useridIsType} from "$lib/utils/user";
import { pathIsStatic } from '$lib/utils/routes';
import * as nostrjson from '$lib/well-known/nostr.json'

// TODO read from and write to nostr.json file 
// export const ssr = false;

export const reroute: Reroute = ({ url}) => {
    let path = url.pathname.split('/');
    let reroute:string, pubid:string|undefined;

    if(!pathIsStatic(url)){
        // reroute 'name' from well-known/nostr.json to '/[pubid]'
        if (path[1] in nostrjson.names) {
            path[1] = (nostrjson.names as any)[path[1]]
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

