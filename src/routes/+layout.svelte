<script>
  import "../app.css";
  import SponsorFooter from "$lib/components/SponsorFooter.svelte";
  import AppHeader from "$lib/components/AppHeader.svelte";
</script>
<AppHeader></AppHeader>
<main class="px-2 pt-2 pb-[100px] flex flex-col items-center w-full">
    <slot />
</main>
<SponsorFooter></SponsorFooter>