import * as qrlib from '$lib/utils/qrlib.js'
import QRCode from 'easyqrcodejs-nodejs';
import { json } from '@sveltejs/kit';
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
        qrcodeObj = new QRCode(qrlib.getQRCodeOptions(qrparams));
        console.log('qrcode generated');
    }catch{
        throw console.log('failed to generate qrcode on server')
	}
	// TODO get params from cookie data
    let dataurl = await qrcodeObj.toDataURL()
    if(dataurl) console.log('qrcode dataurl generated');
    let qrcode = new URL(dataurl);
    return json({ qrcode }, { status: 201 });
}
