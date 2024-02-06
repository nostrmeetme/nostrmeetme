import {redirect} from '@sveltejs/kit';
/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({cookies, request}) => {
        const data = await request.formData();
        let userid = data.get('userid');
        // login via nip05 or npub or pubkey
        if(userid) {throw redirect(303,'/'+userid);}
        // login via browser exension
        return;
    }
};