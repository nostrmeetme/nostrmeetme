import type { Reroute } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const reroute: Reroute = ({ url}) => {
    let path = url.pathname.split('/');
    let reroute:string|undefined, name:string|undefined;

    if(url.pathname == '/.well-known/nostr.json') {
        reroute = '/api/nip05'
    }

    if(!!reroute) {
        return reroute;
    }
}


// https://snippets.khromov.se/configure-cors-in-sveltekit-to-access-your-api-routes-from-a-different-host/
export const handle: Handle = async ({ resolve, event }) => {

    // Apply CORS header for API routes
    if (event.url.pathname.startsWith('/api')) {
      // Required for CORS to work
      if(event.request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
          }
        });
      }
    }
  
    const response = await resolve(event);
    if (event.url.pathname.startsWith('/api')) {
          response.headers.append('Access-Control-Allow-Origin', `*`);
    }
    return response;
  };