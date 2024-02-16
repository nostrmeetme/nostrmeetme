<script lang="ts">
    import InvitationCard from "$lib/components/InvitationCard.svelte";
    import {page} from "$app/stores";
    import {Invite} from '$lib/utils/invite';

    // let invitecode = $page.params.invitecode;
    const invite = new Invite().fromURL($page.url);

    if(invite){

    }
</script>


<InvitationCard nip46={invite?.options.usenip46} ></InvitationCard>