import {createNDKUserFrom} from '$lib/utils/user';
import {user} from '$lib/stores/user';
import ndk from '$lib/stores/ndk';
import { get } from 'svelte/store';
// import { load } from "../manime/+page.server";

/** @type {import('./$types').PageLoad} */
export async function load({params}){
    // await ndk = get(ndk);
    console.log('calling page load');
    await createNDKUserFrom(params.pubid,'nip05',get(ndk)).then((u) => {
        user.set(u);
    })
}