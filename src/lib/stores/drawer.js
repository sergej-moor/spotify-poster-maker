import { writable } from 'svelte/store';

const drawerOpen = writable(false);
export { drawerOpen };
