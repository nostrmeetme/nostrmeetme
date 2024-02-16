<script lang="ts">
    import ProfileCard from "$lib/components/ProfileCard.svelte";
    import {page} from "$app/stores";
    let pubid =  $page.params.pubid;
    console.log('npub detected in route')
</script>
<ProfileCard idtype="npub" pubid="{pubid}">

</ProfileCard>