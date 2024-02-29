import type { LayoutLoad } from './$types';
import {Auth, type UseridTypes, useridIsType} from '$lib/utils/user';

export const ssr = false;
/**
 * @returns $page.data properties for entire app
 */
export const load: LayoutLoad = async ({fetch}) => {
	// load auth for every page
	// return Auth 
};

