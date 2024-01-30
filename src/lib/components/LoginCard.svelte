<script lang="ts">
  import locale from "$lib/locale/en.json";
</script>

<div class="card bg-neutral text-center py-3 max-w-640" style="margin: 0 auto;">
    <p class="px-5 text-left text-sm">&#8681; {locale.component.LoginCard.messagepubkey}</p>
    <form method="POST" class="flex justify-between p-2">
        <input name="userid" class="input input-bordered input-primary w-[75%] " type="text" placeholder="{locale.component.LoginCard.input}"/>
        <button type="submit" class="hidden"></button>
        <button  class="btn w-[20%] btn-primary btn-disabled"><small>{locale.component.LoginCard.button}</small></button>
    </form>
    <p class="px-5 text-right text-sm">{locale.component.LoginCard.messageprivkey} &#8679;</p>
</div>
