<script>
	import AlbumDrawer from './AlbumDrawer.svelte';
	import TracksDrawer from './TracksDrawer.svelte';
	import PaletteDrawer from './PaletteDrawer.svelte';

	/** @type {'album' | 'tracks' | 'palette'} */
	let activeTab = 'tracks';

	function setActiveTab(tab) {
		activeTab = tab;
	}
</script>

<div class="btm-nav md:hidden">
	<AlbumDrawer isActive={activeTab === 'album'} on:click={() => setActiveTab('album')} />
	<TracksDrawer isActive={activeTab === 'tracks'} on:click={() => setActiveTab('tracks')} />
	<PaletteDrawer isActive={activeTab === 'palette'} on:click={() => setActiveTab('palette')} />
</div>
