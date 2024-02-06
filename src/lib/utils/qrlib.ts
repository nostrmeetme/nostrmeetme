
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
// end user options for configuration of invite QRCodes
// JSON object will be hashed with `pubkey` and `timestamp`
// to provide a unique param for URL routes at /invite/[invitecode]
export type InviteCodeOptions = { 
    // TODO ...
}
