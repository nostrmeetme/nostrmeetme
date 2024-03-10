<script lang="ts">
  import locale from "$lib/locale/en.json";
  import { Auth, NIP05_DOMAIN} from "$lib/utils/user";

  // const dispatch = createEventDispatcher();
  let pubidPlaceholderDomain = '@' + NIP05_DOMAIN;
  let pubidPlaceholderDefaultValue = locale.component.LoginCard.pubid_placeholder + pubidPlaceholderDomain;
  let loginNip07ButtonText = locale.component.LoginCard.nip07_button;
  let useLoginType : 'nip07' | 'username' | 'npub' | 'nip05' = 'nip07';

    /**
     * 
     * @param event
     */
  function handleLoginInput(event:KeyboardEvent | MouseEvent){
        let submit = false;
        let pubidInputElement = document.getElementById('LoginCardPubidInput') as HTMLInputElement;
        let pubidPlaceholderElement = document.getElementById('LoginCardPubidPlaceholder') as HTMLInputElement;
        let passwordInputElement = document.getElementById('LoginCardPasswordInput') as HTMLInputElement;
        let pubidInputValue : string | undefined = undefined;
        let passwordInputValue : string | undefined = undefined;
        if(pubidInputElement) pubidInputValue = pubidInputElement?.value == '' ? undefined : pubidInputElement.value;
        if(passwordInputElement) passwordInputValue = passwordInputElement?.value == '' ? undefined : passwordInputElement.value;

        if(event instanceof MouseEvent){
            submit = true;
        }
        if(event instanceof KeyboardEvent){
          let key = event.key;
          // TODO auto suggest kind0 profiles from api.nostr.wine 
          if(key == "Enter") {
            submit = true;
          }else{
            let placeholderValue = pubidInputValue;
            if(!placeholderValue){
              useLoginType = 'nip07';
              placeholderValue = pubidPlaceholderDefaultValue;
            }else{
              useLoginType = 'username';
              if(!placeholderValue.includes('@')) {
                if(pubidInputValue?.startsWith('npub')){
                  useLoginType = 'npub';
                  placeholderValue = '';
                }else{
                  placeholderValue += pubidPlaceholderDomain;
                }
              }else{
                let domain = pubidPlaceholderDomain;
                let domainpart = '@' + placeholderValue.split('@')[1];
                if(domain.startsWith(domainpart)){
                  placeholderValue += domain.replace(domainpart,'')
                }else{
                  // WARN nip46 style cross domain login not supported
                  useLoginType = 'nip05';
                }
              }
            }
            pubidPlaceholderElement.value = placeholderValue;
          }
        }
      if(submit) Auth.login(pubidInputValue, passwordInputValue, true); 
    }

</script>

<div class="bg-neutral text-center p-5 pt-4 w-full" style="margin: 0 auto;">
  <div class="max-w-[420px]" style="margin:0 auto;">
    <div class="text-center">
      <p class="pb-3 text-info text-xl">{locale.component.LoginCard.welcome_message}</p>
      <div class="w-full flex space-x-2">
        <div class="join divide-x divide-solid  w-full bg-base-100 border-primary rounded-lg input input-primary p-0">
          <div class="persistent-placeholder join-item container p-[22px] w-full input-primary">
            <input id="LoginCardPubidInput" type="text" class="actual" name="pubid" on:keyup={(event) => handleLoginInput(event)}/>
            <input id="LoginCardPubidPlaceholder" autocomplete="off" value={pubidPlaceholderDefaultValue} class="placeholder" disabled/>
          </div>
          {#if useLoginType == 'username'}
          <input id="LoginCardPasswordInput" class="w-[60%] input-primary join-item pl-3" type="password" name="password" placeholder={locale.component.LoginCard.password_placeholder}
            on:keyup={(event) => handleLoginInput(event)}/>
          {/if}
          {#if useLoginType != 'nip07' }
          <button class="btn btn-border btn-primary join-item p-2" on:keyup={(event) => handleLoginInput(event)}>&#x23CE;</button>
          {/if}
        </div>
        {#if useLoginType == 'nip07'}
        <button class="btn btn-primary w-[40%]" style="gap:0; white-space:pre-line" 
          on:click={(event) => handleLoginInput(event)}>
          <span class="opacity-90">{loginNip07ButtonText}</span></button>
        {/if}
      </div>
    </div>
    {#if useLoginType == 'nip05'}
    <div>
      <p class="text-secondary text-sm pt-2">Only PUBLIC login available for outside domains.
        <br/><a href="#" class="text-primary text-bold">Learn how to get a nostrmeet.me address.</a>
      </p>
    </div>
    {/if}
    <div class="flex justify-between opacity-75">
      <p class="pt-2 p-2 text-left text-info text-sm w-[50%]" style="white-space:pre-line;" >
        {locale.component.LoginCard.pubuser_help} 
      </p>
      <p class="pt-2 p-2 text-left text-info text-sm w-[40%]"  style="white-space:pre-line;">
        {locale.component.LoginCard.secuser_help} 
      </p>
    </div>
  </div>
</div>

<!-- 
  https://medium.com/@Cuadraman/how-to-recreate-google-s-input-persistent-placeholder-8d507858e815#.1vs0vyigx 
-->
<style>
  .persistent-placeholder.container {
   display: block;
   position: relative;
   height: 36px;
   box-sizing: border-box;
}

.persistent-placeholder input.placeholder {
   height: auto;
   width: 100%;
   color: #666;
   z-index: 0;
   position: absolute;
   top: 0; bottom: 0;
   left: 0; right: 0;
   background-color: transparent;
   border: none;
   text-indent: 10px;
   line-height: 1.2rem;
   font-size: 1rem;
}

.persistent-placeholder input.actual {
  z-index: 1;
   width: 100%;
   background-color: transparent;
   position: absolute;
   top: 0;  bottom: 0;
   left: 0;  right: 0;
   box-sizing: border-box;
   border: none;
   text-indent: 10px;
   line-height: 1.2rem;
   font-size: 1rem;
}
input::placeholder{
  color:#666;
  font-size : .8rem;
  /* white-space:pre-line; */
}
</style>