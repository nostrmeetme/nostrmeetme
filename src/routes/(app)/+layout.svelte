<script lang="ts">
  import "../../app.css";
  import { user } from "$lib/stores/user";
  import NavFooter from "$lib/components/NavFooter.svelte";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import ndk from '$lib/stores/ndk';
  import { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { dateTomorrow } from '$lib/utils/helpers';
  import LoginCard from "$lib/components/LoginCard.svelte";
  import * as userlib from "$lib/utils/user";

  let savestore = false;
  let signerModal = false;

  // import { init as initNostrLogin } from "nostr-login"
 

  $: if (savestore && $user) {
      // Get the user
      window.sessionStorage.setItem('nostrmeetme_user', JSON.stringify($user));
  }

  if (browser) {
      // make sure this is called before any window.nostr calls are made
      // initNostrLogin({theme:'purple',startScreen:'signup',bunkers:'nostrmeet.me,nsec.app'})
      const storedUser = window.sessionStorage.getItem('nostrmeetme_user');
      if (storedUser) {
          console.log('retrieving stored user frm session')
          user.set(JSON.parse(storedUser));
          document.cookie = `userNpub=${
              $user?.npub
          }; expires=${dateTomorrow()}; SameSite=Lax; Secure`;
      }
      savestore = true;
  }

  
  async function login(domEvent: any) {
    domEvent.preventDefault();
    console.log('login called');
    try {
      if(!$user) $user = new NDKUser({});
      const signer = new NDKNip07Signer();
      $ndk.signer = signer;
      ndk.set($ndk);
      signer.user().then(async (ndkUser) => {
        console.log('loging in user : '+ndkUser.npub)
          if (!!ndkUser.npub) {
              ndkUser.ndk = $ndk;
              user.set(ndkUser);
              window.sessionStorage.setItem(
                  'nostrmeetme_user',
                  JSON.stringify(ndkUser)
              );
              document.cookie = `userNpub=${ndkUser.npub};expires=${dateTomorrow()}; SameSite=Lax; Secure`;
              if(ndkUser?.profile?.nip05){
                goto(`/${ndkUser.profile.nip05}`);
              }else{
                goto(`/${ndkUser.npub}`);
              }
              // if (window.plausible) pa.addEvent('Log in');
              // toast.success('Logged in');
          }
      });
      if (domEvent?.detail?.redirect) goto(domEvent.detail.redirect);
    } catch (error: any) {
        console.error(error.message);
        signerModal = true;
    }
  }

  function logout(e: Event) {
    e.preventDefault();
    user.set(undefined);
    window.sessionStorage.removeItem('nostrmeetme_user');
    document.cookie = 'userNpub=';
    // if (window.plausible) pa.addEvent('Log out');
    goto('/');
  }

  let mainpadding = $user ? 'px-2 pt-5' : '';

</script>
  <AppHeader  on:login={login} on:logout={logout}></AppHeader>
  {#if !$user}
  <LoginCard on:login={login} ></LoginCard>
  {/if}
  <main class="{mainpadding} pb-[100px] flex flex-col items-center">
      <slot />
  </main>
{#if $user}
<NavFooter></NavFooter>
{/if}
