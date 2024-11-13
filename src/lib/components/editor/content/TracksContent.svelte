<script>
	import { Eye, EyeOff } from 'lucide-svelte';
	import { posterStore } from '$lib/stores/poster';

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
</script>

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
					autofocus="false"
					tabindex="-1"
				/>
				<button class="btn btn-ghost btn-sm" on:click={() => toggleTrackVisibility(index)}>
					{#if track.visible}
						<Eye class="h-4 w-4" />
					{:else}
						<EyeOff class="h-4 w-4 text-gray-400" />
					{/if}
				</button>
			</div>
		{/each}
	</div>
</div>
