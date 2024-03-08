import {env} from '$env/dynamic/private';
import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NostrJson } from './NostrJson';


export interface S3ObjectInput {
    Bucket : string, // The path to the directory you want to upload the object to, starting with your Space name.
    Key : string, // Object key, referenced whenever you want to access this file later.
}
export interface S3PutObjectInput extends S3ObjectInput {
    Body : {}, // The object's contents. This variable is an object, not a string.
    ACL : "private" | "public-read" | "public-read-write" | "authenticated-read" | "aws-exec-read" | "bucket-owner-read" | "bucket-owner-full-control", // Defines ACL permissions, such as private or public.
    Expires? : number, // unix timestamp
    Metadata? : {} // Defines metadata tags.
}


export class s3 {

    private static _client:S3Client;
    private static get client(){
        if(!env.SPACES_REGION || !env.SPACES_ENDPOINT || !env.SPACES_KEY || !env.SPACES_SECRET)
        throw('missing required ENV credentals for s3 client');
        return s3._client || new S3Client({
            forcePathStyle: false, // Configures to use subdomain/virtual calling format.
            region: env.SPACES_REGION, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (for example, nyc3).
            endpoint: env.SPACES_ENDPOINT, // Find your endpoint in the control panel, under Settings. Prepend "https://".
            credentials: {
                accessKeyId: env.SPACES_KEY, // Access key pair. You can create access key pairs using the control panel or API.
                secretAccessKey: env.SPACES_SECRET // Secret access key defined through an environment variable.
            }
        } as any);}

    private static async send (op:'get' | 'put', S3ObjectInput:S3ObjectInput) : Promise<string | undefined>  {
        const command = op == 
            'get' ? GetObjectCommand : 
            'put' ? PutObjectCommand : 
            undefined;
        if(!command) throw('invalid command given');
        try {
            const data = await s3.client.send(new command(S3ObjectInput));
            console.log(
            "Success s3.send('"+op+"') to : " +
            S3ObjectInput.Bucket +
                "/" +
                S3ObjectInput.Key
            );
            return await data.Body?.transformToString();
        } catch (err) {
            console.log("send Error", err);
            throw('s3.send() : '+err);
        }
    }


    // Step 3: Define the parameters for the object you want to upload.
    public static async putNostrJson (name:string, pubkey:string, relays:string[]) {
        let nostrjson:NostrJson = new NostrJson(name,pubkey,relays);
        let input:S3PutObjectInput = {
            Bucket : "nostrmeetme", 
            Key : `well-known/${name}.json`, 
            Body : JSON.stringify(nostrjson), 
            ACL : "private", 
            Metadata : {}
        }
        return  await s3.send('put',input).then(async data => {
            return NostrJson.parse(data)
        })  
    }

    // Step 3: Define the parameters for the object you want to upload.
    public static async getNostrJson (myname:string) {
        let input:S3ObjectInput = {
            Bucket : "nostrmeetme", 
            Key : `well-known/${myname}.json`, 
        }
        return  await s3.send('get',input).then(async data => {
            return NostrJson.parse(data)
        })
    }

}




export { NostrJson };
// Step 5: Call the uploadObject function.
// uploadS3Object();