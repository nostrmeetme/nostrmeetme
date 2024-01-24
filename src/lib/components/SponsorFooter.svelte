<script lang="ts">
    let sponsor = {
        name : "Blockhenge",
        logo : "https://www.blockhenge.com/images/BH-Logo-Green-Grey-p-500.png",
        productname : "Cryptomnio",
        adtitle : "Connect Once and Trade More",
        adbody : "Cryptomnio is an advanced cryptoasset trading gateway unifying access to exchanges.",
        adimage : "https://www.blockhenge.com/images/Cryptomnio_Logo_Only_HiRes.png",
        adtarget : "https://www.blockhenge.com/cryptomnio.html",
        tag : "sponsored by"
    }
</script>

<footer class="btm-nav h-20">
    <a class="box bg-neutral" href="{sponsor.adtarget}" target="_blank" rel="nofollow">
        <div class="flex justify-center">
            <div class="text-center px-5">
                <div class="flex justify-center h-4">
                    <small class="text-[.5em]">{sponsor.tag} : &nbsp;</small>
                    <img src="{sponsor.logo}" alt="{sponsor.name}" class="h-3"/>
                </div>
                <h2 class="text-lg" style="line-height:1.2em">{sponsor.adtitle}</h2>
                <p class="text-xs" style="line-height:1em">{sponsor.adbody}</p>
            </div>
            <img src="{sponsor.adimage}" alt="{sponsor.productname}" class="w-20 h-15 pr-5"/>
        </div>
    </a>
</footer>