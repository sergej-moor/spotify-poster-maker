<script>
	import { Drawer } from 'vaul-svelte';
	import { ListMusic, Eye, EyeOff } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { posterStore } from '$lib/stores/poster';

	const dispatch = createEventDispatcher();

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

	function handleOpenChange(isOpen) {
		dispatch('openChange', isOpen);
	}
</script>

<Drawer.Root onOpenChange={handleOpenChange}>
	<Drawer.Trigger
		class={`btm-nav-item ${$$props.isActive ? 'active' : ''}`}
		on:click={() => dispatch('click')}
	>
		<div class="flex flex-col items-center">
			<ListMusic />
			<span class="btm-nav-label">Tracks</span>
		</div>
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-fit flex-col rounded-t-[10px] bg-gray-100"
		>
			<div class="flex-1 rounded-t-[10px] bg-white p-4">
				<h2 class="mb-4 text-center text-xl font-bold">Track List</h2>
				<section class="grid max-h-[40vh] scroll-m-2 gap-4 overflow-y-scroll rounded-lg p-4">
					{#each $posterStore.posterData.tracks as track, index}
						<div class="flex items-center">
							<label class=" flex w-full items-center gap-2">
								<div>{(index + 1).toString().padStart(2, '0')}</div>

								<input
									type="text"
									class="input input-sm input-bordered w-full"
									value={track.name}
									on:input={(e) => updateTrackName(index, e.target.value)}
									autofocus="false"
									tabindex="-1"
								/>
							</label>
							<button class="btn btn-ghost btn-sm" on:click={() => toggleTrackVisibility(index)}>
								{#if track.visible}
									<Eye class="h-4 w-4" />
								{:else}
									<EyeOff class="h-4 w-4 text-gray-400" />
								{/if}
							</button>
						</div>
					{/each}
				</section>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
