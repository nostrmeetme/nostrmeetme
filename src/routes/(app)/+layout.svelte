<script>
    import "../../app.css";
    import { user } from "$lib/stores/user";
    import NavFooter from "$lib/components/NavFooter.svelte";
    import AppHeader from "$lib/components/AppHeader.svelte";
  </script>
  <AppHeader></AppHeader>
  <main class="px-2 pt-5 pb-[100px] flex flex-col items-center">
      <slot />
  </main>
{#if $user}
<NavFooter></NavFooter>
{/if}