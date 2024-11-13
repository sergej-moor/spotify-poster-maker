<script>
	import { Disc3, ListMusic, Palette } from 'lucide-svelte';
	import { drawerOpen } from '$lib/stores/drawer';
	import { posterStore } from '$lib/stores/poster';

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
<div class="mb-4 hidden flex-col gap-2 sm:flex">
	<button
		class="btn flex {activeTab === 'album' ? 'btn-primary' : 'btn-ghost'}"
		on:click={() => setActiveTab('album')}
	>
		<Disc3 class="h-5 w-5" />
	</button>
	<button
		class="btn {activeTab === 'tracks' ? 'btn-primary' : 'btn-ghost'}"
		on:click={() => setActiveTab('tracks')}
	>
		<ListMusic class="h-5 w-5" />
	</button>
	<button
		class="btn {activeTab === 'palette' ? 'btn-primary' : 'btn-ghost'}"
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
			{#if activeTab === 'album'}
				<div class="space-y-4">
					<h2 class="text-xl font-bold">Album Settings</h2>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Album Title</span>
						</div>
						<input
							type="text"
							class="input input-bordered w-full"
							value={$posterStore.posterData.title}
							on:input={(e) => updateField('title', e.target.value)}
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Artist</span>
						</div>
						<input
							type="text"
							class="input input-bordered w-full"
							value={$posterStore.posterData.artist}
							on:input={(e) => updateField('artist', e.target.value)}
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Release Date</span>
						</div>
						<input
							type="date"
							class="input input-bordered w-full"
							value={$posterStore.posterData.releaseDate}
							on:input={(e) => updateField('releaseDate', e.target.value)}
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Genre</span>
						</div>
						<input
							type="text"
							class="input input-bordered w-full"
							value={$posterStore.posterData.genre}
							on:input={(e) => updateField('genre', e.target.value)}
						/>
					</label>
				</div>
			{:else if activeTab === 'tracks'}
				<div class="space-y-4">
					<h2 class="text-xl font-bold">Track List</h2>
					<div class="space-y-2">
						{#each $posterStore.posterData.tracks as track, index}
							<div class="flex items-center gap-2">
								<span class="w-6">{(index + 1).toString().padStart(2, '0')}</span>
								<input
									type="text"
									class="input input-sm input-bordered flex-1"
									value={track.name}
									on:input={(e) => updateTrackName(index, e.target.value)}
								/>
								<button class="btn btn-ghost btn-sm" on:click={() => toggleTrackVisibility(index)}>
									{#if track.visible}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"
											><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
											/><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
											/></svg
										>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"
											><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
											/></svg
										>
									{/if}
								</button>
							</div>
						{/each}
					</div>
				</div>
			{:else if activeTab === 'palette'}
				<div class="space-y-4">
					<h2 class="text-xl font-bold">Color Palette</h2>
					<div class="grid gap-2">
						{#each themes as theme}
							<button
								class="flex items-center gap-4 rounded-lg border p-2 hover:bg-gray-50"
								style="background-color: {theme.background}; color: {theme.foreground}; border-color: {theme.foreground}"
								on:click={() => selectTheme(theme)}
							>
								<div class="flex flex-1 items-center justify-between">
									<span class="font-medium">{theme.name}</span>
									<div class="flex gap-2">
										<div
											class="h-6 w-6 rounded-full border"
											style="background-color: {theme.background}; border-color: {theme.foreground}"
										/>
										<div
											class="h-6 w-6 rounded-full border"
											style="background-color: {theme.foreground}; border-color: {theme.background}"
										/>
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
