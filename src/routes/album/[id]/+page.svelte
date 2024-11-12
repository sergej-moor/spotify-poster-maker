<script>
	import { onMount } from 'svelte';
	import { posterStore } from '$lib/stores/poster';
	import Poster from '../../../lib/components/Poster.svelte';
	import PosterEditorPreview from '$lib/components/PosterEditorPreview.svelte';

	export let data;

	onMount(() => {
		posterStore.initialize(data.album);
	});
</script>

<main class="mx-auto max-w-6xl flex-1 overflow-hidden pb-[80px] pt-[72px]">
	<div class="mx-auto lg:w-1/2">
		<PosterEditorPreview />
	</div>
</main>
