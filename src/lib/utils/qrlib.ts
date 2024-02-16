
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

