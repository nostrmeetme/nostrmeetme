<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { user } from '$lib/stores/user';
    import { nip19 } from "nostr-tools";
    // import { Avatar } from '@nostr-dev-kit/ndk-svelte-components';
    import { onMount , onDestroy} from 'svelte';
    import {createNDKUserFrom} from '$lib/utils/user';
    import { copy } from 'svelte-copy';
    import QrCodeImage from "$lib/components/QrCodeImage.svelte";

    export let idtype:string;
    export let userid:string;
    // TODO generate unique signup code bfor each QR, by hash of date and a secret
    let qrid = '12345';
    let error = "";
    
    // if($user == undefined || $user.npub != userid || $user.pubkey != userid || $user.profile?.nip05 != userid){
    onMount(async() => {
        // instantiate user and load profile
        $user = await createNDKUserFrom(idtype,userid,$ndk)
        .then(u => {
            if(u == undefined) error = "User ["+userid+"] cannot be found on Nostr.";
            return u
        })
        .catch(() => console.log('createNDKUserFrom() = user undefined'));

        // get nprofile 
        // if($user){
        //     let relays = await $user.relayList().then((relayList)=>{
        //         const r = [];
        //         if(relayList){
        //             for (const url of relayList.relays) {
        //                 r.push(url);
        //             }
        //             return r;
        //         }
        //     });
        //     relays = relays ? relays : [];
        //     nprofile = await nip19.nprofileEncode({pubkey : $user.pubkey, relays});
        //     nprofile.trim();
        //     nprofile = 'nostr:'+nprofile;
        // }
        
    });
    onDestroy(async() => {
        $user = undefined;
    });
    // }
</script>

{#if $user}
<div class="flex justify-center px-5">
<div class="card bg-black w-min">
    <figure>
        <div role="tablist" class="tabs tabs-boxed bc-primary justify-center bg-black">
            <input aria-label="Follow Me" type="radio" name="qr_tabs" role="tab" class="tab" style="width:185px" checked/>
            <div role="tabpanel" class="tab-content h-[410px] w-[380px] pt-[8px]" style="overflow:hidden">
                <QrCodeImage 
                qrcodeid="profile"
                qrdata="nostr:{$user.npub}" 
                qrimage="{$user.profile?.image}" 
                qrtitle="{$user.profile?.displayName || $user.profile?.name}"
                qrsubtitle="{$user.profile?.nip05 || $user.npub}"></QrCodeImage>
                <div class="flex justify-between w-full pb-5">
                    <button class="btn btn-sm text-info" use:copy={$user.npub}>Copy npub</button>
                    <a class="btn btn-sm text-info" href="nostr:{$user.npub}">Launch client</a>
                </div>
            </div>

            <input aria-label="Create Account"  type="radio" name="qr_tabs" role="tab" class="tab" style="width:185px" disabled/>
            <div role="tabpanel" class="tab-content h-[380px] w-[380px] pt-[8px]" style="overflow:hidden">
                <QrCodeImage 
                qrcodeid="signup-"{qrid}
                qrdata="https://nostrmeet.me/{$user.profile?.nip05 || $user.npub}/signup/" 
                qrimage="{$user.profile?.image}" 
                qrtitle="{$user.profile?.displayName || $user.profile?.name}"
                qrsubtitle="{$user.profile?.nip05 || $user.npub}"></QrCodeImage>
            </div>
        </div>
    </figure>
    <div class="card-body items-center text-center px-5 pt-0 pb-5">
        <div class="w-full flex justify-center " style="position:relative;">
            <div class="avatar" style="position:absolute; top:-150px">
                <div class="rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 w-[150px]">
                    <img src={$user.profile?.image} alt="avatar"/>
                </div>
            </div>
        </div>


        <h2 class="card-title">{$user.profile?.displayName || $user.profile?.name}</h2>
        <p class="text-info">{$user.profile?.nip05}</p>
        <div class="tooltip tooltip-right" data-tip="copy npub">
            <button use:copy={$user.npub}><small class="badge text-secondary p-3 text-xs"><b>npub</b><code>{`${$user.npub.slice(4, 14)}...`}</code> </small> <big>&#10697;</big></button>
        </div>
        <p class="">{$user.profile?.about}</p>

    </div>   
</div>
</div>
{/if}
{#if !$user}
<div class="flex flex-col gap-4 w-[420px] p-5 indicator">
    {#if error}<p class="alert alert-error w-max">{error}</p>{/if}
    <div class="skeleton h-[240px] w-full"></div>
    {#if !error}<div class="indicator-item loading loading-bars loading-lg" style="top:150px; left:40%"></div>{/if}
    <div class="flex gap-4 flex-col items-center w-full" style="margin-top:-75px">
        <div class="flex flex-col items-center gap-4 w-[75%]">
            <div class="skeleton w-[120px] h-[120px] rounded-full shrink-0"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-40 w-full"></div>
        </div>
    </div>
  </div>
{/if} 