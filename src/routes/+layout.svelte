<script>
  import "../app.css";
  import SponsorFooter from "$lib/components/SponsorFooter.svelte";
  import AppHeader from "$lib/components/AppHeader.svelte";
</script>
<AppHeader></AppHeader>
<main class="p-5">
  <slot />
</main>
<SponsorFooter></SponsorFooter>