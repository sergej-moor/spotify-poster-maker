<script>
	import { onMount } from 'svelte';
	import Poster from './Poster.svelte';
	import { posterStore } from '$lib/stores/poster';
	import { drawerOpen } from '$lib/stores/drawer';
	/** @type {HTMLElement} */
	let container;
	/** @type {number} */
	let posterScaling = 1;

	$: ({ size } = $posterStore);

	function updateScale() {
		if (container) {
			const containerWidth = container.parentElement?.clientWidth || window.innerWidth;
		
			const availableHeight = $drawerOpen ? window.innerHeight * 0.3 : window.innerHeight * 0.9;

			const widthScale = containerWidth / size.x;
			const heightScale = availableHeight / size.y;

			posterScaling = Math.min(widthScale, heightScale);
	
		}
	}

	$: scaledWidth = Math.round(size.x * posterScaling);

	$: scaledHeight = Math.round(size.y * posterScaling);

	$: if ($drawerOpen !== undefined) {
		setTimeout(updateScale, 0);
	}

	onMount(() => {
		updateScale();
		window.addEventListener('resize', updateScale);
		return () => window.removeEventListener('resize', updateScale);
	});
</script>

<div
	bind:this={container}
	class={` flex w-full items-start justify-center  ${
		$drawerOpen ? 'h-[35vh] ' : ' '
	}`}
>
	<div
		class="relative overflow-hidden drop-shadow-lg transition-all duration-300 "
		style="width: {scaledWidth}px; height: {scaledHeight}px;"
	>
		<div
			class="origin-center p-4"
			style="transform-origin: center center; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scale({posterScaling});"
		>
			<Poster width={size.x} height={size.y} />
		</div>
	</div>
</div>
