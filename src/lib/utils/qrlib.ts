
export const INVITE = 'invite';
export const PROFILE = 'profile';

export type QRCodeTypes = 'invite'|'profile';
export type QRCodeParams = {
    data:string,
    title?:string,
    subtitle?:string,
    image?:string,
    type?:QRCodeTypes,
    logo?:string,
    size?:number
}

let primaryColor = "#8200E5";
let bgColor = "#000";

export function getQRCodeOptions(params:QRCodeParams) {
    params.size = Math.min(params.size || 380,380)
    return {
        text : params.data,
        title : params.title,
        backgroundImage : params.image,
        subTitle: params.subtitle,
        logo : params.logo, 
        backgroundImageAlpha : 1,
        width: params.size,
        height: params.size,
        titleTop : 23,
        titleBackgroundColor: bgColor, 
        titleHeight: 50,
        titleFont: "normal normal bold 28px Arial Black", 
        titleColor: primaryColor,
        subTitleFont: "normal normal bold 10px Arial", // font. default is "14px Arial"
        subTitleColor: primaryColor, // color. default is "4F4F4F"
        subTitleTop: 40, // draws y coordinates. default is 0
        logoWidth : params.size * 1.3,
        logoHeight : params.size * 1.3,
        logoBackgroundTransparent : true,
        autoColor : true,
        autoColorDark : "rgba(0, 0, 0, .8)",
        autoColorLight: "rgba(255, 255, 255, .8)",
        // version : 10,
        dotScale: .5,
        quietZone: 0,
        quietZoneColor: bgColor,
        // correctLevel: undefined // should be High correction level
    }
}