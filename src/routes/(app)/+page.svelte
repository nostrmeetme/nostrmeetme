<script lang="ts">
    import SiteLogoCard from "$lib/components/SiteLogoCard.svelte";
    import AppPromoCard from "$lib/components/AppPromoCard.svelte";
    import AppTimeline from "$lib/components/AppTimeline.svelte";
    import AwardsPromoCard from "$lib/components/AwardsPromoCard.svelte";
    import AppCreditsList from "$lib/components/AppCreditsList.svelte";
</script>

<SiteLogoCard></SiteLogoCard>
<AppPromoCard></AppPromoCard>
<br>
<section class="w-full bg-accent">
        <AwardsPromoCard></AwardsPromoCard>
</section>
<footer class="w-full bg-neutral py-20 px-10">
    <div class="max-w-96 grid gap-20" style="margin:0 auto;">
        <AppCreditsList></AppCreditsList>
        <AppTimeline></AppTimeline>
    </div>
</footer>