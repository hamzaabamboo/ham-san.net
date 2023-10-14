import { writable } from 'svelte/store';

export const localizationUrls = writable<Record<string, string>>({});
