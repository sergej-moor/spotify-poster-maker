<script>
	import { Disc3, ListMusic, Palette } from 'lucide-svelte';
	import { drawerOpen } from '$lib/stores/drawer';
	import { posterStore } from '$lib/stores/poster';
	import AlbumContent from './content/AlbumContent.svelte';
	import TracksContent from './content/TracksContent.svelte';
	import PaletteContent from './content/PaletteContent.svelte';
	/** @type {'album' | 'tracks' | 'palette'} */
	let activeTab = 'tracks';

	function setActiveTab(tab) {
		activeTab = tab;
		// For mobile, we need to control the drawer checkbox
		const drawerCheckbox = document.getElementById('my-drawer-2');
		if (drawerCheckbox) {
			drawerCheckbox.checked = true;
		}
	}

	// Album related functions
	function updateField(field, value) {
		posterStore.updatePosterData({ [field]: value });
	}

	// Tracks related functions
	function updateTrackName(index, name) {
		const updatedTracks = $posterStore.posterData.tracks.map((track, i) =>
			i === index ? { ...track, name } : track
		);
		posterStore.updatePosterData({ tracks: updatedTracks });
	}

	function toggleTrackVisibility(index) {
		const updatedTracks = $posterStore.posterData.tracks.map((track, i) =>
			i === index ? { ...track, visible: !track.visible } : track
		);
		posterStore.updatePosterData({ tracks: updatedTracks });
	}

	// Palette related functions
	const themes = posterStore.getThemes();
	function selectTheme(theme) {
		posterStore.setTheme(theme);
		posterStore.updatePosterData({
			backgroundColor: theme.background,
			foregroundColor: theme.foreground
		});
	}
</script>

<!-- Navigation Buttons -->
<div class="mb-4 hidden flex-col gap-4 p-2 sm:flex">
	<button
		class="btn btn-circle flex {activeTab === 'album' ? 'btn-primary' : 'btn-ghost'}"
		on:click={() => setActiveTab('album')}
	>
		<Disc3 class="h-5 w-5" />
	</button>
	<button
		class="btn btn-circle {activeTab === 'tracks' ? 'btn-primary' : 'btn-ghost'}"
		on:click={() => setActiveTab('tracks')}
	>
		<ListMusic class="h-5 w-5" />
	</button>
	<button
		class="btn btn-circle {activeTab === 'palette' ? 'btn-primary' : 'btn-ghost'}"
		on:click={() => setActiveTab('palette')}
	>
		<Palette class="h-5 w-5" />
	</button>
</div>
<div class="drawer hidden w-fit sm:drawer-open sm:block">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

	<div class="drawer-side">
		<!-- <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label> -->
		<div class="menu min-h-full w-80 bg-base-200 p-4 text-base-content">
			<!-- Content based on active tab -->
			<!-- Content based on active tab -->
			{#if activeTab === 'album'}
				<AlbumContent />
			{:else if activeTab === 'tracks'}
				<TracksContent />
			{:else if activeTab === 'palette'}
				<PaletteContent />
			{/if}
		</div>
	</div>
</div>
