<script lang="ts">
    import ndk from '$lib/stores/ndk';
    import { user } from '$lib/stores/user';
    // import { Avatar } from '@nostr-dev-kit/ndk-svelte-components';
    import { onMount , onDestroy} from 'svelte';
    import * as userLib from '$lib/utils/user';
    import { copy } from 'svelte-copy';
    import QrCodeImage from "$lib/components/QrCodeImage.svelte";
    export let idtype:userLib.PubidTypes|undefined = undefined;
    export let userid:string|undefined = undefined;
    // TODO generate unique signup code bfor each QR, by hash of date and a secret
    let qrid = '12345';
    let error = "";

    // if($user == undefined || $user.npub != userid || $user.pubkey != userid || $user.profile?.nip05 != userid){
    onMount(async() => {
        console.log('ProfileCard component mounted');
        // instantiate user and load profile
        if(idtype && userid){
            $user = await userLib.createNDKUserFrom(userid,idtype,$ndk)
            .then(u => {
                if(u == undefined) {
                    // TODO throw error
                    error = "User ["+userid+"] cannot be found on Nostr.";
                    if(idtype == 'nip05'){
                        let { username, domain } = userLib.parseNip05(userid);
                        error = "The nip05 name ["+username+"] cannot be found at domain ["+domain+"]. Try again using your npub."
                    }
                }
                return u
            })
            .catch(() => console.log('createNDKUserFrom() = user undefined'));
        }
        if(!user){
            throw console.log("no user available to render ProfileCard");
        }        
    });
    onDestroy(async() => {
        $user = undefined;
    });
    // }
</script>

{#if $user}
<div class="flex justify-center px-3">
<div class="card bg-black w-min">
    <figure>
        <div role="tablist" class="tabs tabs-boxed justify-center bg-black p-0">
            <input aria-label="Follow Me" type="radio" name="qr_tabs" role="tab" class="tab bg-neutral" style="width:185px" checked/>
            <div role="tabpanel" class="tab-content h-[410px] w-[380px]" style="overflow:hidden;">
                <div class="border-primary border-solid border-2">
                    <QrCodeImage 
                    qrtype="profile"
                    qrdata="nostr:{$user.npub}" 
                    qrimage="{$user.profile?.image}" 
                    qrtitle="{$user.profile?.displayName || $user.profile?.name}"
                    qrsubtitle="{$user.profile?.nip05 || $user.npub}"
                    qrlogo=""></QrCodeImage>
                </div>
                <div class="flex justify-between w-full pb-5">
                    <button class="btn btn-sm text-info" use:copy={$user.npub}>Copy npub</button>
                    <a class="btn btn-sm text-info" href="nostr:{$user.npub}">Launch client</a>
                </div>
            </div>

            <input aria-label="Create Account"  type="radio" name="qr_tabs" role="tab" class="tab" style="width:185px" disabled/>
            <div role="tabpanel" class="tab-content h-[380px] w-[380px] pt-[8px]" style="overflow:hidden">
                <!-- <QrCodeImage 
                qrtype="invite"
                qrdata="https://nostrmeet.me/{$user.profile?.nip05 || $user.npub}/signup/" 
                qrimage="{$user.profile?.image}" 
                qrtitle="{$user.profile?.displayName || $user.profile?.name}"
                qrsubtitle="{$user.profile?.nip05 || $user.npub}"></QrCodeImage> -->
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
        <p class="" style="overflow-wrap: break-word; word-break: break-word;">{$user.profile?.about}</p>

    </div>   
</div>
</div>
{/if}
{#if !$user}
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