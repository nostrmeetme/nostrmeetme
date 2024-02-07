<script>
    import SiteLogoCard from "./SiteLogoCard.svelte";
    import LoginCard from "./LoginCard.svelte";
    import AppCreditsList from "$lib/components/AppCreditsList.svelte"
    import locale from "$lib/locale/en.json";
    import { user } from '$lib/stores/user';
</script>
<header class="box bg-primary text-center pb-1">
    <h1 class="title text-[2.5em] indicator" style="line-height:1em;margin-top:10px">
        <span class="indicator-item badge badge-secondary" style="top:3px">ALPHA</span> 
        <span>{locale.app.header.title}</span></h1>

    <div class="flex justify-between align-center items-center">
        {#if $user}      
        <button class="avatar placeholder text-[25px] pl-2" onclick="creditsModal.showModal()">
                <div class="text-neutral rounded-full w-[25px] ring ring-neutral">
                    <span>&#9829;︎</span>
                </div>
                <span class="text-xl  text-base-100">&nbsp;&#9662;</span>
            </button>  
        {/if}
        <p class="tagline w-full">{locale.app.header.tagline}</p> 
        {#if $user}      
        <button class="avatar pr-2" onclick="userModal.showModal()" >
            <span class="text-xl  text-neutral">&#9662;&nbsp;</span>
            <div class="rounded-full w-[25px] ring ring-neutral">
                <img src={$user.profile?.image} alt="avatar"/>
            </div>
        </button>
        {/if}
        {#if !$user}
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

{#if $user}
<dialog id="userModal" class="modal modal-top modal-right">
    <div class="modal-box pr-10 bg-neutral">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="font-bold text-lg">User Settings</h3>
        <p class="py-4 text-right"><a href="/">Logout</a></p>
        <div class="modal-action">
        </div>
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