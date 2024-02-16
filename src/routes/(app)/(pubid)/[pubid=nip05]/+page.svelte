<script lang="ts">
    import ProfileCard from "$lib/components/ProfileCard.svelte";
    import {page} from "$app/stores";
    // import {createNDKUserFrom} from '$lib/utils/user';
    import {user} from '$lib/stores/user';
    // import ndk from '$lib/stores/ndk';
    // import { load } from "../manime/+page.server";
    let pubid = $page.params.pubid;
    console.log('nip05 detected in route')

    // /** @type {import('./$types').PageLoad} */
    // export function load({}){
    //     console.log('calling page load');
    //     createNDKUserFrom(pubid,'nip05').then((u) => {
    //         $user = u;
    //     })
    // }
</script>
{#if $user}
<ProfileCard idtype="nip05" pubid="{pubid}"></ProfileCard>
{/if}