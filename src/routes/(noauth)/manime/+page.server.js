import { redirect } from '@sveltejs/kit';

let npub = 'npub1manlnflyzyjhgh970t8mmngrdytcp3jrmaa66u846ggg7t20cgqqvyn9tn';
export function load() {
    throw redirect(303, '/'+npub);
}
