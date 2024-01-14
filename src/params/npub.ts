/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
    var isnpubformat: boolean = true;
    if(param.startsWith('npub') != true) isnpubformat = false;
    if(param.length.valueOf() != 63) isnpubformat = false;
    if(param.search(/^[a-z0-9]*$/) !== 0) isnpubformat = false;
    return isnpubformat;
}