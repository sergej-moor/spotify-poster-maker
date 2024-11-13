<script>
	import { posterStore } from '$lib/stores/poster';

	function updateField(field, value) {
		posterStore.updatePosterData({ [field]: value });
	}
</script>

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
			autofocus="false"
			tabindex="-1"
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
			autofocus="false"
			tabindex="-1"
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
			autofocus="false"
			tabindex="-1"
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
			autofocus="false"
			tabindex="-1"
		/>
	</label>
</div>
