<script lang="ts">
    import locale from "$lib/locale/en.json";

const developers =  [
    {   
        username : "manime",
        npub : "npub1manlnflyzyjhgh970t8mmngrdytcp3jrmaa66u846ggg7t20cgqqvyn9tn",
    },
];
const collaborators = [
    {
        username : "I)ruid",
        npub : "npub1san22nhe59ct8pstcehav4dtkf94lkn46ltl7d30g3zzl00tg7ussgqjdd",
    }	

]
const sponsors = [
    {
        name : "Blockhenge",
        href : "https://blockhenge.com",
        logo : "https://www.blockhenge.com/images/Blockhenge_Logo_2C_Primary_RGB.gif"
    },
];
const awardSponsors = [

]

</script>
<div id="appCreditsList" class="grid text-center py-5 max-w-96 gap-5">
    <h3 class="font-bold text-2xl">{locale.component.AppCreditsList.madewithlove}</h3>
    <h4>{locale.component.AppCreditsList.sponsors}</h4>
    <div class="grid gap-3">
    {#each sponsors as sponsor}
            {#if sponsor.name}
            <a class="card bg-[#666] p-2" href="{sponsor.href ?? '#'}" target="_blank" rel="nofollow">
                <img class="" src="{sponsor.logo}" alt="{sponsor.name}"/>
            </a>
            {/if}
    {/each}
    </div>
    <h4>{locale.component.AppCreditsList.developers}</h4>
    <div class="grid gap-3">
        {#each developers as dev}
        <div class="card bg-base-100  p-2 text-center">
            <a href="/{dev.npub}" target="_blank" rel="nofollow">@{dev.username}</a>
        </div>
        {/each}
    </div>
    <h4>{locale.component.AppCreditsList.collaborators}</h4>
    <div class="grid gap-3">
        {#each collaborators as colab}
        <div class="card bg-base-100  p-2 text-center">
            <a href="/{colab.npub}" target="_blank" rel="nofollow">@{colab.username}</a>
        </div>
        {/each}
    </div>
</div>