<script>
  import "../../app.css";
  import NavFooter from "$lib/components/NavFooter.svelte";
  import AppHeader from "$lib/components/AppHeader.svelte";
</script>
<AppHeader></AppHeader>
<main class="flex flex-col items-center">
    <slot />
</main>
<!-- <NavFooter></NavFooter> -->