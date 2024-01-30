<script lang="ts">
    import ProfileCard from "$lib/components/ProfileCard.svelte";
    import {page} from "$app/stores";
    let userid = $page.params.userid;
    console.log('nip05 detected in route')
</script>
<ProfileCard idtype="nip05" userid="{userid}">

</ProfileCard>