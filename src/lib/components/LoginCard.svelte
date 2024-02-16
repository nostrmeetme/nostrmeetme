<script lang="ts">
  import locale from "$lib/locale/en.json";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<div class="bg-neutral text-center p-5 pb-10 w-full" style="margin: 0 auto;">
  <div class="max-w-[420px]" style="margin:0 auto;">
    <div class="flex justify-between p-2">
      <form method="POST" class="w-[70%]">
        <input name="userid" class="input input-bordered input-info w-full" type="text" placeholder="{locale.component.LoginCard.input}"/>
        <button type="submit" class="hidden"></button>
      </form>
      <button  class="btn w-[20%] btn-primary" on:click={() => dispatch('login',true)}><small>{locale.component.LoginCard.button}</small></button>
    </div>
      <p class="px-3 pt-2 text-left text-info">{locale.component.LoginCard.messagemvp}</p>
  </div>
</div>
