<script>
    import locale from "$lib/locale/en.json";
    let accounts =  {
            dev : {
                username : "manime",
                npub : "npub1manlnflyzyjhgh970t8mmngrdytcp3jrmaa66u846ggg7t20cgqqvyn9tn",
            },
            sponsor : {
                username : "I)ruid",
                npub : "npub1san22nhe59ct8pstcehav4dtkf94lkn46ltl7d30g3zzl00tg7ussgqjdd",
            }	
        };
</script>
<header class="box bg-primary text-center pb-1">
    <h1 class="title text-[2.5em]" style="line-height:1em">
    <a href="/">{locale.app.header.title}</a></h1>
    <p class="tagline">{locale.app.header.tagline}</p> 
    <p class="credits text-xs text-base-100">
    {locale.app.header.credit} :
    <a href="/{accounts.dev.npub}">@{accounts.dev.username}</a> 
    +
    <a href="/{accounts.sponsor.npub}">@{accounts.sponsor.username}</a></p>
</header>