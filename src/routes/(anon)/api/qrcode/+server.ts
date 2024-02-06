// import {getUserProfileQRCode} from '$lib/utils/qrcodes.server';
// import type { NDKUser } from '@nostr-dev-kit/ndk';
import * as qrlib from '$lib/utils/qrlib.js'
import QRCode from 'easyqrcodejs-nodejs';
import { json } from '@sveltejs/kit';
import * as fs from 'fs/promises';
// import * as ImageType from 'image-type'
import {followOverlayURI} from '$lib/assets/nostrmeetme-qroverlay-follow.json';
import {signupOverlayURI} from '$lib/assets/nostrmeetme-qroverlay-signup.json';

/** @type {import('./$types').RequestHandler} */
/**
 * @returns qrcode image url for use in <img> src attribute
 */
export async function POST({request,cookies}) {
    console.log('POST request recieved for qrcode');
    let qrcodeObj:QRCode;
	let qrparams:qrlib.QRCodeParams;

	try{
		qrparams = await request.json();
        if(!qrparams?.logo){
            qrparams.logo = qrparams.type == qrlib.INVITE ? signupOverlayURI : followOverlayURI;
        }
        qrcodeObj = generateQRCode(qrparams);
        console.log('qrcode generated');
    }catch{
        throw console.log('failed to generate qrcode on server')
	}
	// TODO get params from cookie data
    let dataurl = await qrcodeObj.toDataURL()
    if(dataurl) console.log('qrcode dataurl generated');
    let qrcode = new URL(dataurl);
    return json({ qrcode }, { status: 201 });
    // return new URL(url);
}


/**
 * @returns new QRCode instance
 */
function generateQRCode(params:qrlib.QRCodeParams){

    let primaryColor = "#8200E5";
    let bgColor = "#000";
    const qroptions = {
        text : params.data,
        title : params.title,
        backgroundImage : params.image,
        subTitle: params.subtitle,
        logo : params.logo, 
        backgroundImageAlpha : 1,
        width: 360,
        height: 360,
        titleTop : 23,
        titleBackgroundColor: bgColor, 
        titleHeight: 50,
        titleFont: "normal normal bold 28px Arial Black", 
        titleColor: primaryColor,
        subTitleFont: "normal normal bold 10px Arial", // font. default is "14px Arial"
        subTitleColor: primaryColor, // color. default is "4F4F4F"
        subTitleTop: 40, // draws y coordinates. default is 0
        logoWidth : 460,
        logoHeight : 460,
        logoBackgroundTransparent : true,
        autoColor : true,
        autoColorDark : "rgba(0, 0, 0, .5)",
        autoColorLight: "rgba(255, 255, 255, .5)",
        // version : 10,
        dotScale: .6,
        quietZone: 10,
        quietZoneColor: bgColor,
        correctLevel : QRCode.CorrectLevel.H
    }
    return new QRCode(qroptions);
}


async function imageToDataUrl(imagepath:string|undefined){
    // const fs = require('fs')
    // const imageType = require('image-type');
    let dataurl:string = '';
    if(imagepath){
    const contents = await fs.readFile(imagepath,"base64");
    // const b64 = contents.toString('base64');
    
    // const type = imageType(contents);
    // if (type.mime === null) {
    //   console.log('error with imageToDataUrl')
    // }
    
    dataurl = `data:image/png;base64,${contents}`;
    // return `data:${type.mime};base64,${b64}`;
    }
    return dataurl;
}
