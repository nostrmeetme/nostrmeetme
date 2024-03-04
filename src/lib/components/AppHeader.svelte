<script lang="ts">
    import AppCreditsList from "$lib/components/AppCreditsList.svelte"
    import locale from "$lib/locale/en.json";
    import { Auth } from "$lib/utils/user";

    $: pubuser = Auth.pubuser;
    $: secuser = Auth.secuser;
    $: hasPubuserPubkey = Auth.pubkeys?.pubuser;
</script>
<header class="box bg-primary text-center pb-1">
    <h1 class="title text-[2.5em] indicator" style="line-height:1em;margin-top:10px">
        <span class="indicator-item badge badge-secondary p-2 text-xs" style="top:-2px;right:1px">v0.2 alpha</span> 
        <span>{locale.app.header.title}</span></h1>

    <div class="flex justify-between align-center items-center">
        {#if $pubuser}      
        <button class="avatar placeholder text-[25px] pl-2" onclick="creditsModal.showModal()">
                <div class="text-secondary rounded-full w-[25px]">
                    <span>&#9829;︎</span>
                </div>
                <span class="text-xl  text-neutral">&nbsp;&#9662;</span>
            </button>  
        {/if}
        <p class="tagline w-full">{locale.app.header.tagline}</p> 
        {#if $pubuser}      
        <button class="avatar pr-2" onclick="userModal.showModal()" >
            <span class="text-xl  text-neutral">&#9662;&nbsp;&nbsp;</span>
            <div class="rounded-full w-[25px] ring ring-neutral">
                <img src={$pubuser.profile?.image} alt="avatar"/>
            </div>
        </button>
        {/if}
        {#if !$pubuser}
        <!-- <button class="avatar placeholder pr-2" onclick="loginModal.showModal()">
            <span class="loading loading-ring loading-md text-black"></span>
        </button> -->
        {/if}

    </div>    
</header>

<dialog id="creditsModal" class="modal modal-top modal-left text-right">
    <div class="modal-box pl-10 bg-neutral">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute left-2 top-2">✕</button>
        </form>
        <AppCreditsList></AppCreditsList>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

{#if $pubuser}
<dialog id="userModal" class="modal modal-top modal-right">
    <div class="modal-box pr-10 bg-neutral">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        {#if $secuser}
        <h3 class="font-bold text-md">{locale.app.auth.secuser.loggedin}</h3>
        <p class="stacked py-4 text-right">
            <span class="p-2">{$secuser.profile?.displayName || $secuser.profile?.name || $secuser.profile?.nip05}&nbsp;</span>
            <button class="btn btn-sm btn-primary" on:click={() => Auth.logout(true)}>
                {locale.app.auth.secuser.logout}</button>
        </p>
        {/if}
        {#if hasPubuserPubkey}
        <h3 class="font-bold text-md">{locale.app.auth.pubuser.loggedin}</h3>
        <p class="py-4 stacked  text-right">
            <span class="p-2">{$pubuser.profile?.displayName || $pubuser.profile?.name || $pubuser.profile?.nip05}&nbsp;</span>
            <button class="btn btn-sm btn-primary" on:click={() => Auth.logout(false,'/qr')}>
                {locale.app.auth.pubuser.logout}</button>
        </p>
        {/if}
        {#if !hasPubuserPubkey}
        <h3 class="font-bold text-md">{locale.app.auth.pubuser.login}</h3>
          <div class="join w-full">
            <input id="LoginMenuPubidInput" class="input join-item input-bordered input-primary text-center w-[70%]" type="text"
              placeholder="{locale.component.LoginCard.input_pubuser}"
              on:keydown={(event) => Auth.handlePubidInput(event,'LoginMenuPubidInput')}/>
            <button class="btn join-item btn-primary w-[30%]" 
              on:click={(event) => Auth.handlePubidInput(event,'LoginMenuPubidInput')}>
              Go</button>
          </div>
        {/if}
        {#if !$secuser}
        <h3 class="font-bold text-md">{locale.component.LoginCard.button_secuser}</h3>
        <p class="stacked py-4 text-right">
            <button  class="btn btn-sm btn-primary" on:click={() => Auth.login(true)}>
                <small>{locale.app.auth.secuser.login}</small></button>
        </p>
        {/if}
        
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
{/if}

<style>
    .modal.modal-top .modal-box {
        margin-top:75px
    }
    .modal.modal-top.modal-left .modal-box,
    .modal.modal-top.modal-right .modal-box {
        width:250px;
    }
    .modal.modal-top.modal-right {
        justify-items:end;
    }
</style>