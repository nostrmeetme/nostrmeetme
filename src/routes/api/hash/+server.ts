import { bytesToHex } from '@noble/hashes/utils'
import { sha256 } from '@noble/hashes/sha256'
import { utf8Encoder } from 'nostr-tools/utils'
import { json } from '@sveltejs/kit';
import { SALT } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({request}){
    try{
        let data = await request.json();
        let hash = toHash(data);
        return json({ hash }, { status: 201 });
    }catch{
        return json({ }, { status: 204 });
    }

}

function toHash(value:any): String {
    let json = JSON.stringify(value);
    let hash = sha256(utf8Encoder.encode(json+SALT));
    return bytesToHex(hash);
}