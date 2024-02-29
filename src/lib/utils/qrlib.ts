
export const INVITE = 'invite';
export const PROFILE = 'profile';

export type QRCodeTypes = 'invite'|'profile';
export type QRCodeParams = {
    data:string,
    title?:string,
    subtitle?:string,
    image?:string,
    type?:QRCodeTypes,
    logo?:string
}

let primaryColor = "#8200E5";
let bgColor = "#000";

export function getQRCodeOptions(params:QRCodeParams) {
    return {
        text : params.data,
        title : params.title,
        backgroundImage : params.image,
        subTitle: params.subtitle,
        logo : params.logo, 
        backgroundImageAlpha : 1,
        width: 370,
        height: 370,
        titleTop : 23,
        titleBackgroundColor: bgColor, 
        titleHeight: 50,
        titleFont: "normal normal bold 28px Arial Black", 
        titleColor: primaryColor,
        subTitleFont: "normal normal bold 10px Arial", // font. default is "14px Arial"
        subTitleColor: primaryColor, // color. default is "4F4F4F"
        subTitleTop: 40, // draws y coordinates. default is 0
        logoWidth : 480,
        logoHeight : 480,
        logoBackgroundTransparent : true,
        autoColor : true,
        autoColorDark : "rgba(0, 0, 0, 1)",
        autoColorLight: "rgba(255, 255, 255, 1)",
        // version : 10,
        dotScale: .5,
        quietZone: 0,
        quietZoneColor: bgColor,
        // correctLevel: undefined // should be High correction level
    }
}