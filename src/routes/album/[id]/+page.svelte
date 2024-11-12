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

<div class=" flex w-screen items-center overflow-hidden px-4 pb-2">
	<main class="mx-auto max-w-screen-md flex-1 overflow-hidden pb-[80px] pt-[72px]">
		<div class="mx-auto lg:w-1/2">
			<PosterEditorPreview />
		</div>
	</main>
</div>
