<script lang="ts">
  import "../../app.css";
  import NavFooter from "$lib/components/NavFooter.svelte";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import {Auth} from "$lib/utils/user";
	
  $: pubuser = Auth.pubuser;

  // do not add padding around home page main
  $: mainpadding = $pubuser ? 'px-2 pt-3' : '';

</script>
  <AppHeader></AppHeader>
  <main class="{mainpadding} pb-[100px] flex flex-col items-center">
      <slot />
  </main>
{#if $pubuser}
<NavFooter></NavFooter>
{/if}
