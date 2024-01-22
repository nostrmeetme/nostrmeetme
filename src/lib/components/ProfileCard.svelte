<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { user } from '$lib/stores/user';
    import { Avatar } from '@nostr-dev-kit/ndk-svelte-components';
    import { onMount } from 'svelte';
    import {createNDKUserFrom} from '$lib/utils/user';

    export let idtype:string;
    export let userid:string;
    
    if($user == undefined){
    onMount(async() => {
        $user = await createNDKUserFrom(idtype,userid,$ndk)
        .then(u => {return u})
        .catch(() => console.log('createNDKUserFrom() = user undefined'));
    });
    }
</script>
<div>
    {#if $user}
    <!-- <pre>{JSON.stringify($user)}</pre> -->
    <Avatar ndk={$ndk} npub={$user.npub} class="w-8 h-8 rounded-sm m-0" />
    <span class="badge">{$user.profile?.displayName ?? $user.profile?.name}</span> 
    <span class="badge">{$user.profile?.nip05 ?? $user.profile?.name}</span> 
    <span class="badge"><b>npub</b>{`${$user.npub.slice(4, 13)}...`}</span>
    {/if}
    {#if !$user}
    <span>[{userid}] user not loaded</span>
    {/if} 
</div>
