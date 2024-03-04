<script lang="ts">
    import { goto } from "$app/navigation";
    import { Auth, PUBUSER, SECUSER } from "$lib/utils/user";
    
    export const ssr = false;
    
    const secuserPubkey = Auth.pubkeys ? Auth.pubkeys[SECUSER] : undefined;
    const pubuserPubkey = Auth.pubkeys ? Auth.pubkeys[PUBUSER] : undefined;
    // fwd '/qr' route to logged in user qr screen
    
    if(secuserPubkey){
        goto('/'+secuserPubkey)
    }
    else
    if(pubuserPubkey){
        goto('/'+pubuserPubkey)
    }
    else {
        goto('/')
    }
</script>