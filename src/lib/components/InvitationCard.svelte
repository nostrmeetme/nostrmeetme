<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { init as initNostrLogin } from "nostr-login"

    export let nip46 = false;

    if(browser && nip46){
        initNostrLogin({theme:'purple',startScreen:'signup',bunkers:'nostrmeet.me,nsec.app'})
    }
    onMount( async () => {
    })
</script>

<nl-button title-btn="Sign Up" start-screen="signup" nl-theme="purple"></nl-button>
<!-- <nl-auth theme="purple" start-screen="signup"></nl-auth> -->
<!-- <nl-signup isOpen="true" showModal="true"></nl-signup> -->

<style>
    div.nl-bg > div.flex.justify-between {
      background-color:black;
    }
    /* div.nl-bg > div.flex.justify-between > div.flex.gap-2.items-center > svg */
    .nl-bg > .flex.justify-between > *:last-child > *:last-child {
      display:initial;
    }
  
</style>