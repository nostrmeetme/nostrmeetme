<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { user } from '$lib/stores/user';
    import { Avatar } from '@nostr-dev-kit/ndk-svelte-components';
    import { onMount , onDestroy} from 'svelte';
    import {createNDKUserFrom} from '$lib/utils/user';
    import { copy } from 'svelte-copy';

    export let idtype:string;
    export let userid:string;
    
    // if($user == undefined || $user.npub != userid || $user.pubkey != userid || $user.profile?.nip05 != userid){
    onMount(async() => {
        $user = await createNDKUserFrom(idtype,userid,$ndk)
        .then(u => {return u})
        .catch(() => console.log('createNDKUserFrom() = user undefined'));
    });
    onDestroy(async() => {
        $user = undefined;
    });
    // }
</script>
<div class="card card-side bg-neutral">
    {#if $user}
    <figure class="pl-10 pr-5">
        <Avatar ndk={$ndk} npub={$user.npub} class="rounded-full w-[120px]" />
    </figure>
    <div class="card-body p-5">
        <div>
            <h2 class="card-title">{$user.profile?.displayName ?? $user.profile?.name}</h2>
            <p class="text-info">{$user.profile?.nip05 ?? $user.profile?.name}
            </p>
            <div class="tooltip tooltip-right" data-tip="copy npub">
                <button use:copy={$user.npub}><small class="badge text-secondary p-3 text-xs"><b>npub</b><code>{`${$user.npub.slice(4, 18)}...`}</code> </small> <big>&#10697;</big></button>
            </div>
            </div>
        <p>{$user.profile?.about?.slice(0,60)}...</p>
    </div>
    {/if}
    {#if !$user}
    <div class="flex flex-col gap-4 w-full p-5 indicator">
        <div class="indicator-item indicator-start loading loading-spinner loading-lg"></div>
        <div class="flex gap-4 items-center">
            <div class="skeleton w-[120px] h-[120px] rounded-full shrink-0"></div>
          <div class="flex flex-col gap-4 w-full">
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-12 w-full"></div>
        </div>
        </div>
      </div>
    {/if} 
</div>
