<script lang="ts">
    import InvitationCard from "$lib/components/InvitationCard.svelte";
    import {page} from "$app/stores";
    import {Invite} from '$lib/utils/invite';
    import locale from "$lib/locale/en.json";
    import { createEventDispatcher, onMount } from 'svelte';
    import type { LayoutData } from "../../$types";
  import AppCreditsList from "$lib/components/AppCreditsList.svelte";
  import AppHeader from "$lib/components/AppHeader.svelte";
  import { Auth } from "$lib/utils/user";

    let login = Auth.loginFromDom
    // let pubuser = $page.data.pubuser
    let invite:Invite;
    onMount( async () => {
        invite = await new Invite().fromURL($page.url).then(i=>i);
    })
    </script>
    <p>
    sign up to nostr!
    </p>

{#if invite}
<InvitationCard on:login={login}></InvitationCard>
{/if}