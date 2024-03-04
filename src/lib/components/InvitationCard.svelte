<script lang="ts">
    import { onMount } from 'svelte';
    import locale from "$lib/locale/en.json";
    import { launch as launchNostrLoginDialog } from "nostr-login"
    import { page } from '$app/stores';
    import { Auth } from '$lib/utils/user';
    import { NDKUser } from '@nostr-dev-kit/ndk';
    import { Invite } from '$lib/utils/invite';
    import { copy } from 'svelte-copy';
    import { goto } from '$app/navigation';
    import { STATIC_ROUTES } from '$lib/utils/routes';
    
    let invite:Invite;
    $: invite = new Invite($page.url);
    // console.log('rendering invite : '+JSON.stringify(invite.toJSON()));
    let advocate: NDKUser;
    $: advocate;
    let aboutlimit = 250;
    onMount(async () => {
      advocate = await invite.getAdvocate();
    })

    let optsNostrLogin = {
          theme:'purple',
          startScreen:'signup',
      }
    async function onSignupClick() {
      let secuserPubkey = await launchNostrLoginDialog(optsNostrLogin);
      Auth.login({secuser:(secuserPubkey as string)},STATIC_ROUTES.FRIENDS)
    }

</script>
<div class="p-3 grid space-y-5 w-full max-w-[400px]">
{#if advocate?.profile}
<div class="card bg-neutral">
  <div class="flex">
    <div class="avatar py-5 pl-5">
      <div class="rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 w-[75px] h-[75px]">
          <img src={advocate.profile?.image} alt="avatar"/>
      </div>
    </div>
    <div class="card-body pt-3 pb-2" style="position:relative;">
      <h2><big><b>{advocate.profile?.displayName || advocate.profile?.name}</b></big>
        <span class="tooltip tooltip-right text-right" data-tip="copy npub">
          <button class="btn-sm p-0" use:copy={advocate.npub}>
              <small class="badge text-secondary p-3 text-xs">
                  <b>npub</b><code>{`${advocate.npub.slice(4, 16)}…`}</code>
              </small>
              <big>&#10697;</big>
          </button>
        </span>
        <i>{advocate.profile?.nip05}</i>
      </h2>

    </div>
  </div>
  <hr class="border-primary">
  <div class="px-5 pt-2 pb-5">  
    <p class="text-sm" style="overflow-wrap: break-word; word-break: break-word;">
      {#if invite.isvalid}
        {advocate.profile?.about?.slice(0,aboutlimit)}
        {#if Number(advocate.profile?.about?.length) > aboutlimit+1}…{/if}
      {/if}
      {#if !invite.isvalid}
        {locale.component.InviteCard.default_advocate}
      {/if}
    </p>
  </div>
</div>  
{/if}


{#if !advocate?.profile}
<div class="flex flex-col gap-4 w-full indicator">
    <div class="skeleton h-[200px] w-full bg-neutral"></div>
    <div class="indicator-item loading loading-bars loading-lg" style="top:100px; left:40%"></div>
  </div>
{/if} 


<div class="grid justify-center text-center space-y-1 px-2">
  <h2 class="text-2xl">{locale.component.InviteCard.welcome}</h2>
  <p>{locale.component.InviteCard.help_msg}</p>
  <div class="p-5">
    <button  class="btn w-full btn-primary text-2xl" 
    on:click={onSignupClick}>
      {locale.component.InviteCard.button}</button>
  </div>
</div>

<p class="text-sm text-[#888] text-center">
  {locale.component.InviteCard.aboutnostr}
</p>
<h3 class="text-lg text-center">{locale.component.InviteCard.ownyoursocials} 
  <a href="https://nostr.how" target="_blank" class="text-primary text-xl">{locale.component.InviteCard.learnmore}</a>
</h3>

<style>
  div.nl-bg > div.flex.justify-between {
    background-color:black;
  }
  /* div.nl-bg > div.flex.justify-between > div.flex.gap-2.items-center > svg */
  .nl-bg > .flex.justify-between > *:last-child > *:last-child {
    display:initial;
  }
</style>

</div>
