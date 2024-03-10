
export const STATIC_ROUTES = {
    AWARD : '/award', 
    CHAT : '/chat', 
    QR : '/qr', 
    FRIENDS : '/friends', 
    APPS : '/apps',
    INVITE : '/invite'
};

export function pathIsStatic(url:URL, ){
    for(let route in STATIC_ROUTES){
        if(url.pathname.startsWith(route)){
            return true;
        }
    }
    return false;
}

export function staticPath(url?:URL){
    if(url){
    for(let route in STATIC_ROUTES){
        if(url.pathname.startsWith(route)){
            return route;
        }
    }}
}