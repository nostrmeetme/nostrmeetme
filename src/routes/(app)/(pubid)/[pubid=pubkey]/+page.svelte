<script lang="ts">
    import ProfileCard from "$lib/components/ProfileCard.svelte";
    import {page} from "$app/stores";
    let pubid =  $page.params.pubid;
    console.log('pubkey detected in route')
</script>
<ProfileCard idtype="pubkey" pubid="{pubid}">

</ProfileCard>