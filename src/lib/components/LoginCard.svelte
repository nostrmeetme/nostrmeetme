<script lang="ts">
  import locale from "$lib/locale/en.json";
</script>

<div class="bg-neutral text-center p-5 pb-10 w-full" style="margin: 0 auto;">
  <div class="max-w-[420px]" style="margin:0 auto;">
    <form method="POST" class="flex justify-between p-2">
        <input name="userid" class="input input-bordered input-info w-[75%] " type="text" placeholder="{locale.component.LoginCard.input}"/>
        <button type="submit" class="hidden"></button>
        <button  class="btn w-[20%] btn-primary btn-disabled"><small>{locale.component.LoginCard.button}</small></button>
    </form>
    <p class="px-3 pt-2 text-left text-info">{locale.component.LoginCard.messagemvp}</p>
  </div>
</div>
