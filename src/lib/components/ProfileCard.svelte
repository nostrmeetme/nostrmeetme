<script lang="ts">
    import { onMount , onDestroy} from 'svelte';
    import { copy } from 'svelte-copy';
    import QrCodeImage from "$lib/components/QrCodeImage.svelte";
    import {Invite} from '$lib/utils/invite'
    import { page } from '$app/stores';
   import { Auth } from '$lib/utils/user';
    import { browser } from '$app/environment';

    // TODO generate unique signup code bfor each QR, by hash of date and a secret
    let qrid = '12345';
    let error = "";
    let inviteurl: string;
    let pubuser = Auth.pubuser;
    $: qrwidth = 0;
    $: tabwidth = 0;
    $: qrheight = 0;

    // if(pubuser == undefined || pubuser.npub != pubid || pubuser.pubkey != pubid || pubuser.profile?.nip05 != pubid){
    onMount(async() => {
        console.log('ProfileCard component mounted');
        // user.set()
        if($pubuser) {
            // inviteurl = new URL('/');
            let invite = new Invite($pubuser);
            inviteurl = await invite.toURL($page.url.origin);
        }else{
            throw console.log("no user available to render ProfileCard");
        }
        qrwidth = Math.min(window.innerWidth - 20, 380);
        qrheight = qrwidth + 30;
        tabwidth = qrwidth * .5;
    });
    onDestroy(async() => {
        // pubuser = undefined;
    });
    // }
</script>

{#if  $pubuser && $pubuser.profile && qrwidth}
<div class="flex justify-center px-3">
<div class="card bg-black w-min">
    <figure style="min-height:{qrheight}px">
        <div role="tablist" class="tabs tabs-boxed justify-between bg-black p-0">
            <input aria-label="Create Account"  type="radio" name="qr_tabs" role="tab" class="tab" style="width:{tabwidth}px" checked/>
            <div role="tabpanel" class="tab-content h-[{qrheight}px] w-[{qrwidth}px]" style="overflow:hidden;">
            {#if inviteurl}
                <div class="border-primary border-solid border-2">
                    <QrCodeImage 
                    qrtype="invite"
                    qrdata="{inviteurl}" 
                    qrimage="{$pubuser.profile?.image}" 
                    qrtitle="{$pubuser.profile?.displayName || $pubuser.profile?.name}"
                    qrsubtitle="{$pubuser.profile?.nip05 || $pubuser.npub}"
                    qrsize={qrwidth}
                    qrlogo=""></QrCodeImage>
                </div>
                <div class="flex justify-between w-full pb-5">
                    <button class="btn btn-sm text-info" use:copy={inviteurl}>Copy Invite Url</button>
                    <a class="btn btn-sm text-info" href="{inviteurl}" target="_blank">Go To Invite</a>
                </div>
            {/if}
            </div>

            <input aria-label="Follow Me" type="radio" name="qr_tabs" role="tab" class="tab" style="width:{tabwidth}px"/>
            <div role="tabpanel" class="tab-content h-[{qrheight}px] w-[{qrwidth}px]" style="overflow:hidden;">
                <div class="border-primary border-solid border-2">
                    <QrCodeImage 
                    qrtype="profile"
                    qrdata="nostr:{$pubuser.npub}" 
                    qrimage="{$pubuser.profile?.image}" 
                    qrtitle="{$pubuser.profile?.displayName || $pubuser.profile?.name}"
                    qrsubtitle="{$pubuser.profile?.nip05 || $pubuser.npub}"
                    qrsize={qrwidth}
                    qrlogo=""></QrCodeImage>
                </div>
                <div class="flex justify-between w-full pb-5">
                    <button class="btn btn-sm text-info" use:copy={$pubuser.npub}>Copy npub</button>
                    <a class="btn btn-sm text-info" href="nostr:{$pubuser.npub}">Launch In client</a>
                </div>
            </div>
        </div>
    </figure>
    <div class="card-body items-center text-center px-5 pt-0 pb-5">
        <div class="w-full flex justify-center " style="position:relative;">
            <div class="avatar" style="position:absolute; top:-150px">
                <div class="rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 w-[150px]">
                    <img src={$pubuser.profile?.image} alt="avatar"/>
                </div>
            </div>
        </div>


        <h2 class="card-title">{$pubuser.profile?.displayName || $pubuser.profile?.name}</h2>
        <p class="text-info">{$pubuser.profile?.nip05}</p>
        <div class="tooltip tooltip-right" data-tip="copy npub">
            <button use:copy={$pubuser.npub}>
                <small class="badge text-secondary p-3 text-xs">
                    <b>npub</b><code>{`${$pubuser.npub.slice(4, 14)}...`}</code> 
                </small> 
                <big>&#10697;</big>
            </button>
        </div>
        <p class="" style="overflow-wrap: break-word; word-break: break-word;">{$pubuser.profile?.about}</p>

    </div>   
</div>
</div>
{/if}
{#if !$pubuser}
<div class="flex flex-col gap-4 w-[420px] p-5 indicator">
    {#if error}<p class="alert alert-error w-full">{error}</p>{/if}
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