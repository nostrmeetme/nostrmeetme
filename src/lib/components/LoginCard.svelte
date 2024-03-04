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
      <div class="join w-full">
        <input id="LoginCardPubidInput" class="input join-item input-bordered input-primary text-center w-[70%]" type="text"
          placeholder="{locale.component.LoginCard.input_pubuser}"
          on:keydown={(event) => Auth.handlePubidInput(event,'LoginCardPubidInput')}/>
        <button class="btn join-item btn-primary w-[30%]" 
          on:click={(event) => Auth.handlePubidInput(event,'LoginCardPubidInput')}>
          {locale.component.LoginCard.button_pubuser}</button>
      </div>
    </div>
    <p class="text-accent text-left pt-3 pl-2"><b>Comming soon ...</b></p>
    <div class="flex justify-between">
      <p class="pt-0 p-2 text-left text-info">{locale.component.LoginCard.message_secuser}</p>
      <button  class="btn w-[30%] btn-outline btn-info bg-base-100" on:click={() => handleSecuserLogin()}>
        <span class="text-info">{locale.component.LoginCard.button_secuser}</span></button>
    </div>
  </div>
</div>
