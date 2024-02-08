<script lang="ts">
    import ProfileCard from "$lib/components/ProfileCard.svelte";
    import {page} from "$app/stores";
    let userid =  $page.params.userid;
    console.log('npub detected in route')
</script>
<ProfileCard idtype="npub" userid="{userid}">

</ProfileCard>