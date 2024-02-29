import {redirect} from '@sveltejs/kit';
/** @type {import('./$types').Actions} */
// export const actions = {
//     default: async ({cookies, request}) => {
//         const data = await request.formData();
//         let pubid = data.get('pubid');
//         // login via nip05 or npub or pubkey
//         if(pubid) {throw redirect(303,'/'+pubid);}
//         // login via browser exension
//         return;
//     }
// };