<script>
	import { onMount } from 'svelte';
	import Poster from './Poster.svelte';
	import { posterStore } from '$lib/stores/poster';

	/** @type {HTMLElement} */
	let container;
	/** @type {number} */
	let posterScaling = 1;

	$: ({ size } = $posterStore);

	function updateScale() {
		if (container) {
			const containerWidth = container.parentElement?.clientWidth || window.innerWidth;

			posterScaling = containerWidth / size.x;
		}
	}

	$: scaledWidth = Math.round(size.x * posterScaling);
	$: scaledHeight = Math.round(size.y * posterScaling);

	onMount(() => {
		updateScale();
		window.addEventListener('resize', updateScale);
		return () => window.removeEventListener('resize', updateScale);
	});
</script>

<div
	bind:this={container}
	class="overflow-hidden drop-shadow-lg"
	style="width: {scaledWidth}px; height: {scaledHeight}px;"
>
	<div style="transform: scale({posterScaling}); transform-origin: top left;">
		<Poster width={size.x} height={size.y} />
	</div>
</div>
