<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import locale from "$lib/locale/en.json";
    import { init as initNostrLogin } from "nostr-login"
    import { createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';
    import { Auth } from '$lib/utils/user';

    // const dispatch = createEventDispatcher(); 

    // Auth.useNip46();
    initNostrLogin({
            theme:'purple',
            startScreen:'signup',
            bunkers:'nostrmeet.me,nsec.app'
        })
</script>

<!-- <nl-button title-btn="Sign Up" start-screen="signup" nl-theme="purple"></nl-button> -->
<!-- <nl-auth theme="purple" start-screen="signup"></nl-auth> -->
<!-- <nl-signup isOpen="true" showModal="true"></nl-signup> -->
<button  class="btn w-[20%] btn-primary" on:click={() => Auth.login(true)}><small>{locale.component.LoginCard.button}</small></button>

<style>
    div.nl-bg > div.flex.justify-between {
      background-color:black;
    }
    /* div.nl-bg > div.flex.justify-between > div.flex.gap-2.items-center > svg */
    .nl-bg > .flex.justify-between > *:last-child > *:last-child {
      display:initial;
    }
  
</style>