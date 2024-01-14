/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
    var ispubkeyformat: boolean = true;
    // ispubkeyformat = param.startsWith('npub') ? false : true;
    if(param.length.valueOf() != 64) ispubkeyformat =  false ;
    if(param.search(/^[a-z0-9]*$/) != 0) ispubkeyformat = false ;
    return ispubkeyformat;
}