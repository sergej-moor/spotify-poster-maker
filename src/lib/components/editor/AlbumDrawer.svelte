<script>
	import { Drawer } from 'vaul-svelte';
	import { Disc3 } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { posterStore } from '$lib/stores/poster';

	const dispatch = createEventDispatcher();

	$: title = $posterStore.posterData.title;
	$: artist = $posterStore.posterData.artist;
	$: releaseDate = $posterStore.posterData.releaseDate;
	$: genre = $posterStore.posterData.genre;

	function updateField(field, value) {
		posterStore.updatePosterData({ [field]: value });
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
			<Disc3 />
			<span class="btm-nav-label">Album</span>
		</div>
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-fit  flex-col rounded-t-[10px] bg-gray-100"
		>
			<div class="flex-1 rounded-t-[10px] bg-white p-4">
				<h2 class="mb-4 text-center text-xl font-bold">Album Settings</h2>
				<section class="grid gap-4 rounded-lg p-4">
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Album Title</span>
						</div>
						<input
							type="text"
							class="input input-sm input-bordered w-full"
							value={title}
							on:input={(e) => updateField('title', e.target.value)}
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Artist</span>
						</div>
						<input
							type="text"
							class="input input-sm input-bordered w-full"
							value={artist}
							on:input={(e) => updateField('artist', e.target.value)}
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Release Date</span>
						</div>
						<input
							type="date"
							class="input input-sm input-bordered w-full"
							value={releaseDate}
							on:input={(e) => updateField('releaseDate', e.target.value)}
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Genre</span>
						</div>
						<input
							type="text"
							class="input input-sm input-bordered w-full"
							value={genre}
							on:input={(e) => updateField('genre', e.target.value)}
						/>
					</label>
				</section>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
