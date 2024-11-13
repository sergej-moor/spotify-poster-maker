<script>
	import { onMount } from 'svelte';
	import { posterStore } from '$lib/stores/poster';

	import PosterEditorPreview from '$lib/components/PosterEditorPreview.svelte';
	import { Disc3, ListMusic, Palette } from 'lucide-svelte';

	export let data;

	onMount(() => {
		posterStore.initialize(data.album);
	});
</script>

<div class="   flex w-full items-center overflow-hidden px-4 pb-2">
	<main class="mx-auto max-w-screen-md flex-1 overflow-hidden">
		<div class="mx-8 pb-4 sm:mx-auto lg:w-3/5">
			<PosterEditorPreview />
		</div>
	</main>
</div>
