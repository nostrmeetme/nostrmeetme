<script lang="ts">
  import { onMount } from 'svelte';
  // https://github.com/Superdev0103/QRCodeJS-project
  import * as  QRCode from 'easyqrcodejs';

  export let qrdata : string;
  export let qrimage : string | undefined;
  export let qrtitle : string | undefined;
  export let qrsubtitle : string | undefined;
  export let qrcodeid : string | undefined;


  let logofile = qrcodeid == 'profile' ? 'nostrmeetme-qroverlay-follow.png' : 'nostrmeetme-qroverlay-signup.png';
  let qrcomplete = false;
  let mytheme = {
        
        "primary": "#5b21b6",
                  
        "secondary": "#86198f",
                  
        "accent": "#ea580c",
                  
        "neutral": "#1f2937",
                  
        "base-100": "#111827",
                  
        "info": "#7c3aed",
                  
        "success": "#c026d3",
                  
        "warning": "#ca8a04",
                  
        "error": "#991b1b",
        }
  let qroptions = {
    text : qrdata,
    title : qrtitle,
    backgroundImage : qrimage,
    backgroundImageAlpha : 1,
    width: 360,
    height: 360,
    titleTop : 23,
    titleBackgroundColor: '#000', 
    titleHeight: 50,
    titleFont: "normal normal bold 28px Arial Black", 
    titleColor: mytheme.info,
    subTitle: qrsubtitle, // content
    subTitleFont: "normal normal bold 11px Arial", // font. default is "14px Arial"
    subTitleColor: mytheme.info, // color. default is "4F4F4F"
    subTitleTop: 40, // draws y coordinates. default is 0
    logo : '/src/lib/assets/'+logofile, 
    logoWidth : 440,
    logoHeight : 420,
    logoBackgroundTransparent : true,
    autoColor : true,
    autoColorDark : "rgba(0, 0, 0, .5)",
    autoColorLight: "rgba(255, 255, 255, .5)",
    // version : 10,
    dotScale: .6,
    quietZone: 10,
    quietZoneColor: '#000',
    onRenderingEnd : function(){qrcomplete = true},
    correctLevel : QRCode.CorrectLevel.H
  }
        
  onMount(async () => {
    if(qrcodeid){
      let qrelement = document.getElementById(qrcodeid);
      await new QRCode(qrelement,qroptions);
      qrcomplete = true;
    }
  })
  
</script>
<!-- <div class=""> -->
  <!-- {#if qrcomplete} -->
  <div class="" style="margin-top:-60px" id="{qrcodeid}"></div>
  <!-- {/if}
  {#if !qrcomplete}
  <div class="skeleton w-[420px] h-[420px]"></div>
  {/if} -->
<!-- </div> -->
