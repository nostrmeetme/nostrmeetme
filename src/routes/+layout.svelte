<script>
  import "../app.css";
  import locale from "$lib/locale/en.json";
</script>
<header class="box bg-primary text-center pb-2">
    <h1 class="title text-[2em]">{locale.app.header.title}</h1>
    <p class="tagline">{locale.app.header.tagline}</p> 
</header>
<main class="p-5">
  <slot />
</main>
<footer class="btm-nav">bottom nav</footer>