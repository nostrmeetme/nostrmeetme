
/**
 * let nostrjson : NostrJsonData = {
 *   names:{ 'myname': 'mypubkey' },
 *   relays:{ 'mypubkey' : ['relay01', 'relay02']},
 * }
 */
export type NostrJsonData = {
    names: {[x:string] : string},
    relays?: {[x:string] : string[]},
}
export class NostrJson {
    private _names : {[x:string] : string}
    private _relays? : {[x:string] : string[]}
    constructor(name:string, pubkey:string, relays?:string[]){
        this._names = {[name] : pubkey}
        this._relays = relays ? {[pubkey] : relays} : undefined;    
    }
    get name(){ return Object.keys(this._names)[0] };
    get pubkey(){ return Object.values(this._names)[0] };
    get relays(){ return this._relays?[this.pubkey]:undefined};
    public toObject(){
        let nostrjson:NostrJsonData = {names:this._names, relays:this._relays};
        return nostrjson || {};
    }
    public static parse(nostrjson:NostrJsonData|string|any){
        let name:string, pubkey:string, relays:string[]|undefined;
        if(typeof(nostrjson) == 'string') nostrjson = JSON.parse(nostrjson);
        try{
            name = Object.keys(nostrjson.names)[0];
            if(!name ) throw('missing name')
            pubkey = nostrjson.names[name];
            if(!pubkey) throw('missing pubkey')
            relays = nostrjson.relays?[pubkey]:undefined;
            return new NostrJson(name,pubkey,relays);
        }catch(e){
            console.log('failed to parse NostrJson : '+e)
            return undefined;
        }
    }
}