<script lang="ts">
  import { onMount } from 'svelte';
  import * as qrlib from '$lib/utils/qrlib.js';
  
  export let qrdata : string;
  export let qrimage : string | undefined;
  export let qrtitle : string | undefined;
  export let qrsubtitle : string | undefined;
  export let qrtype : qrlib.QRCodeTypes | undefined;
  export let qrlogo : string | undefined;

  let qrcode : URL;
        
  onMount(async () => {
    const qrparams:qrlib.QRCodeParams = {
      title: qrtitle,
      subtitle: qrsubtitle,
      image: qrimage,
      data: qrdata,
      type: qrtype,
      logo: qrlogo
    }
    const response = await fetch('/api/qrcode', {
			method: 'POST',
      body: JSON.stringify(qrparams),
			headers: {'Content-Type': 'application/json'}
		});
    ({qrcode} = await response.json());
  });
  
</script>

  <div class="" style="margin-top:-60px"> 
    {#if qrcode}
      <img src="{qrcode.toString()}" alt="{qrtype} qr code"/>
    {/if}
  </div>

