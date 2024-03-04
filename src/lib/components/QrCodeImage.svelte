<script lang="ts">
  import { onMount } from 'svelte';
  import * as qrlib from '$lib/utils/qrlib.js';
  import appicon from "$lib/assets/appicon.png";
  
  export let qrdata : string;
  export let qrimage : string | undefined;
  export let qrtitle : string | undefined;
  export let qrsubtitle : string | undefined;
  export let qrtype : qrlib.QRCodeTypes | undefined;
  export let qrlogo : string | undefined;
  export let qrsize : number | undefined;

  let qrcode : URL;
        
  onMount(async () => {
    const qrparams:qrlib.QRCodeParams = {
      title: qrtitle,
      subtitle: qrsubtitle,
      image: qrimage,
      data: qrdata,
      type: qrtype,
      logo: qrlogo,
      size: qrsize
    }
    const response = await fetch('/api/qrcode', {
			method: 'POST',
      body: JSON.stringify(qrparams),
			headers: {'Content-Type': 'application/json'}
		});
    ({qrcode} = await response.json());
  });
  
</script>

  <div class="" style="overflow:hidden"> 
    {#if qrcode}
      <img src="{qrcode.toString()}" alt="{qrtype} qr code" style="margin-top:-50px"/>
    {/if}
    {#if !qrcode}
    <div class="indicator-item loading loading-ring loading-lg" style="top:50%; left:50%; width:100%;height:100%">
      <img src="{appicon}" alt="logo" style="width:100%;height:100%"/>
    </div>
    {/if}

  </div>

