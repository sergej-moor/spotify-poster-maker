<script>
	import AlbumDrawer from './AlbumDrawer.svelte';
	import TracksDrawer from './TracksDrawer.svelte';
	import PaletteDrawer from './PaletteDrawer.svelte';
	import { drawerOpen } from '$lib/stores/drawer';

	/** @type {'album' | 'tracks' | 'palette'} */
	let activeTab = 'tracks';

	function setActiveTab(tab) {
		activeTab = tab;
	}

	function handleDrawerChange(isOpen) {
		drawerOpen.set(isOpen);
	}
</script>

<div class="hidden min-h-full flex-col gap-2 border-r border-primary p-4 sm:flex">
	<AlbumDrawer
		isActive={activeTab === 'album'}
		on:click={() => setActiveTab('album')}
		on:openChange={({ detail }) => handleDrawerChange(detail)}
	/>

	<TracksDrawer
		isActive={activeTab === 'tracks'}
		on:click={() => setActiveTab('tracks')}
		on:openChange={({ detail }) => handleDrawerChange(detail)}
	/>
	<PaletteDrawer
		isActive={activeTab === 'palette'}
		on:click={() => setActiveTab('palette')}
		on:openChange={({ detail }) => handleDrawerChange(detail)}
	/>
</div>
