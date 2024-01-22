import { writable } from 'svelte/store';
import type { NDKUser } from '@nostr-dev-kit/ndk';

export const user = writable<NDKUser | undefined | void>(undefined);

