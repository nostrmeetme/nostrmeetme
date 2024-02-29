<script lang="ts">
  import "../../app.css";
  import NavFooter from "$lib/components/NavFooter.svelte";
  import AppHeader from "$lib/components/AppHeader.svelte";
  // import { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { dateTomorrow } from '$lib/utils/helpers';
  import LoginCard from "$lib/components/LoginCard.svelte";
  import {Auth} from "$lib/utils/user";
  import { page } from "$app/stores";

  import type { LayoutData } from './$types';
	
	export let auth : LayoutData;

  let savestore = false;
  let signerModal = false;

  // $: if (savestore && pubuser) {
  //     // Get the user
  //     // window.sessionStorage.setItem('nostrmeetme_user', JSON.stringify(pubuser));
  // }

  // if (browser) {
  // //     make sure this is called before any window.nostr calls are made
  // //     initNostrLogin({theme:'purple',startScreen:'signup',bunkers:'nostrmeet.me,nsec.app'})
  // //     const storedUser = window.sessionStorage.getItem('nostrmeetme_user');
  // //     if (storedUser) {
  // //         console.log('retrieving stored user frm session')
  // //         user.set(JSON.parse(storedUser));
  // //         document.cookie = `userNpub=${
  // //             pubuser?.npub
  // //         }; expires=${dateTomorrow()}; SameSite=Lax; Secure`;
  // //     }
  // //     savestore = true;
  // }

  
  // async function login(domEvent: any) {
  //   domEvent.preventDefault();
  //   console.log('login called from DOM event');
  //   Auth.login();
  //   // try {
  //   //   if(!pubuser) pubuser = new NDKUser({});
  //   //   const signer = new NDKNip07Signer();
  //   //   appndk.signer = signer;
  //   //   ndk.set(appndk);
  //   //   signer.user().then(async (ndkUser) => {
  //   //     console.log('loging in user : '+ndkUser.npub)
  //   //       if (!!ndkUser.npub) {
  //   //           ndkUser.ndk = appndk;
  //   //           user.set(ndkUser);
  //   //           window.sessionStorage.setItem(
  //   //               'nostrmeetme_user',
  //   //               JSON.stringify(ndkUser)
  //   //           );
  //   //           document.cookie = `userNpub=${ndkUser.npub};expires=${dateTomorrow()}; SameSite=Lax; Secure`;
  //   //           if(ndkUser?.profile?.nip05){
  //   //             goto(`/${ndkUser.profile.nip05}`);
  //   //           }else{
  //   //             goto(`/${ndkUser.npub}`);
  //   //           }
  //   //           // if (window.plausible) pa.addEvent('Log in');
  //   //           // toast.success('Logged in');
  //   //       }
  //   //   });
  //   //   if (domEvent?.detail?.redirect) goto(domEvent.detail.redirect);
  //   // } catch (error: any) {
  //   //     console.error(error.message);
  //   //     signerModal = true;
  //   // }
  // }

  // function logout(domEvent: Event) {
  //   domEvent.preventDefault();
  //   console.log('logout callsed from DOM event')
  //   Auth.logout();
  //   // user.set(undefined);
  //   // window.sessionStorage.removeItem('nostrmeetme_user');
  //   // document.cookie = 'userNpub=';
  //   // // if (window.plausible) pa.addEvent('Log out');
  //   // goto('/');
  // }
  let pubuser = Auth.pubuser;

  // do not add padding around home page main
  let mainpadding = $pubuser ? 'px-2 pt-5' : '';

</script>
  <AppHeader></AppHeader>
  <main class="{mainpadding} pb-[100px] flex flex-col items-center">
      <slot />
  </main>
{#if $pubuser}
<NavFooter></NavFooter>
{/if}
