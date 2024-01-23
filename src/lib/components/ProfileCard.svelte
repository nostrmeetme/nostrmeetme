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
<div class="card card-side bg-neutral">
    {#if $user}
    <!-- <pre>{JSON.stringify($user)}</pre> -->
    <figure class="pl-10 pr-5">
        <Avatar ndk={$ndk} npub={$user.npub} class="rounded-full w-[120px]" />
    </figure>
    <div class="card-body p-5">
        <div>
            <h2 class="card-title">{$user.profile?.displayName ?? $user.profile?.name}</h2>
            <p class="text-info">{$user.profile?.nip05 ?? $user.profile?.name}</p>
            <small class="badge text-secondary p-3 text-xs"><b>npub</b><code>{`${$user.npub.slice(4, 24)}...`}</code></small>
        </div>
        <p>{$user.profile?.about?.slice(0,60)}...</p>
    </div>
    {/if}
    {#if !$user}
    <span>[{userid}] user not loaded</span>
    {/if} 
</div>
