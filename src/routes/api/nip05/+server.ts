import { NostrJson, s3 } from "$lib/utils/s3api";
import { PUBKEY, USERNAME, useridIsType } from "$lib/utils/user";
import { json } from "@sveltejs/kit";

/**
 * get nostrjson
 */
/** @type {import('./$types').RequestHandler} */
export async function GET({url}){
    try{
        let name = url.searchParams.get('name');
        if(!name) throw('no name param provided');
        let nostrjson:NostrJson | undefined;
        if(useridIsType(name) == USERNAME){
            nostrjson = await s3.getNostrJson(name);
        }
        if(nostrjson){
            return json(nostrjson.toObject(), { status: 201, headers:{'Access-Control-Allow-Origin': '*'}});
        }
        else{ 
            throw('name not found')
        }
    }catch(e){
        return json({ error:'could not get NostrJson : '+e}, { status: 500 });
    }
}

export async function PUT({request}){
    try{
        let nostrjson:NostrJson | undefined;
        let {name, pubkey, relays} = await request.json();
        if(!name || !pubkey) throw('no name or pubkey provided');
        if(useridIsType(name) == USERNAME && useridIsType(pubkey) == PUBKEY){
            nostrjson = await s3.putNostrJson(name, pubkey, relays);
        }
        if(nostrjson){
            return json(nostrjson.toObject(), { status: 201 });
        }
        throw('name not found in DB')
    }catch(e){
        return json({ error:'could not get NostrJson : '+e}, { status: 500 });
    }
}
