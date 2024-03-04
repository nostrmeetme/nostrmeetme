<script lang="ts">
  import locale from "$lib/locale/en.json";
  import { Auth } from "$lib/utils/user";
  // import { createEventDispatcher } from 'svelte';
  import { goto } from "$app/navigation";

  // const dispatch = createEventDispatcher();
  const secuser = Auth.secuser;

  function handleSecuserLogin(){
    Auth.login(true).then(() => {
      let userid = $secuser?.profile?.nip05 || $secuser?.npub;
      goto('/'+userid)
    })

  }
</script>

<div class="bg-neutral text-center p-5 pb-10 w-full" style="margin: 0 auto;">
  <div class="max-w-[420px]" style="margin:0 auto;">
    <div class="text-center">
      <p class="p-2 text-left text-info">{locale.component.LoginCard.message_pubuser}</p>
      <input id="LoginCardPubidInput" class="input input-bordered input-info w-full text-center" type="text"
      placeholder="{locale.component.LoginCard.input}"
      on:keydown={(event) => Auth.handlePubidInput(event,'LoginCardPubidInput')}/>
    </div>
    <p class="text-accent text-left pt-3 pl-2"><b>Comming soon ...</b></p>
    <div class="flex justify-between">
      <p class="pt-0 p-2 text-left text-info">{locale.component.LoginCard.message_secuser}</p>
      <button  class="btn w-[33%] btn-primary" on:click={() => handleSecuserLogin()}><small>{locale.component.LoginCard.button}</small></button>
    </div>
  </div>
</div>
