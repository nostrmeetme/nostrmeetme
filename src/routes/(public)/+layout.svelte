<script lang="ts">
  import "../../app.css";
  import AppHeader from "$lib/components/AppHeader.svelte";
  
</script>
  <AppHeader></AppHeader>
  <main class="pb-[100px] flex flex-col items-center">
      <slot />
  </main>

