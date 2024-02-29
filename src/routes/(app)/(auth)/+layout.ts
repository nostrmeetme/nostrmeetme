import { goto } from "$app/navigation";
import { Auth } from "$lib/utils/user";
import type { LayoutLoad } from "../$types";

/**
 * - login users
 * - preload user qrcode image(s)
 * - preload user follow lists
 * - preload user award standings
 * @param param0 
 * @returns 
 */
export const load: LayoutLoad = async ({params,url}) => {
    // if pubid url: set pubuser from pubid
    const pubid = params.pubid;
    // login user from param OR from stored userid
    await Auth.login(pubid);
    // redirect to root page if not logged in.
    if(!!Auth.pubkeys.pubuser){
        console.log('logged in')
    }else{
        console.log('not logged in')
        goto('/',{replaceState:true});
    } 
    // return Auth;
}