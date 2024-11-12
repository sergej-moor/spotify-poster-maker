<script>
	import { Drawer } from 'vaul-svelte';
	import { Disc3 } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { posterStore } from '$lib/stores/poster';

	const dispatch = createEventDispatcher();

	let title = $posterStore.posterData.title;
	let artist = $posterStore.posterData.artist;
	let releaseDate = $posterStore.posterData.releaseDate;
	let genre = $posterStore.posterData.genre;

	function updateField(field, value) {
		posterStore.updatePosterData({ [field]: value });
	}
</script>

<Drawer.Root>
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
		<Drawer.Overlay class="fixed inset-0 bg-black/40" />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-[90%] flex-col rounded-t-[10px] bg-gray-100"
		>
			<div class="flex-1 rounded-t-[10px] bg-white p-4">
				<h2 class="mb-4 text-xl font-bold">Album Settings</h2>
				<section data-vaul-no-drag class="grid gap-4 rounded-lg bg-gray-100 p-4">
					<div class="form-control w-full">
						<label class="label" for="title">
							<span class="label-text">Album Title</span>
						</label>
						<input
							type="text"
							id="title"
							class="input input-bordered w-full"
							value={title}
							on:input={(e) => updateField('title', e.target.value)}
						/>
					</div>

					<div class="form-control w-full">
						<label class="label" for="artist">
							<span class="label-text">Artist</span>
						</label>
						<input
							type="text"
							id="artist"
							class="input input-bordered w-full"
							value={artist}
							on:input={(e) => updateField('artist', e.target.value)}
						/>
					</div>

					<div class="form-control w-full">
						<label class="label" for="releaseDate">
							<span class="label-text">Release Date</span>
						</label>
						<input
							type="date"
							id="releaseDate"
							class="input input-bordered w-full"
							value={releaseDate}
							on:input={(e) => updateField('releaseDate', e.target.value)}
						/>
					</div>

					<div class="form-control w-full">
						<label class="label" for="genre">
							<span class="label-text">Genre</span>
						</label>
						<input
							type="text"
							id="genre"
							class="input input-bordered w-full"
							value={genre}
							on:input={(e) => updateField('genre', e.target.value)}
						/>
					</div>
				</section>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
