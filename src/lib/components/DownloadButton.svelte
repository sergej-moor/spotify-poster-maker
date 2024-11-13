<script>
	import * as htmlToImage from 'html-to-image';
	import { Download, LoaderCircle } from 'lucide-svelte';
	import { posterStore } from '$lib/stores/poster';
	import { mount, unmount } from 'svelte';
	import Poster from '$lib/components/Poster.svelte';

	$: ({ posterData, size } = $posterStore);

	let isCreatingPoster = false;

	async function createPoster() {
		isCreatingPoster = true;
		try {
			// Create off-screen container
			const container = document.createElement('div');
			Object.assign(container.style, {
				position: 'absolute',
				left: '-9999px',
				top: '-9999px',
				width: `${size.x}px`,
				height: `${size.y}px`
			});
			document.body.appendChild(container);

			// Create poster component
			const posterComponent = mount(Poster, {
				target: container,
				props: {
					width: size.x,
					height: size.y
				}
			});

			// Wait for images to load and rendering to complete
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Generate high-quality JPEG
			const dataUrl = await htmlToImage.toJpeg(container.querySelector('#poster'), {
				quality: 1.0,
				pixelRatio: 1
			});

			// Cleanup
			unmount(posterComponent);
			document.body.removeChild(container);

			// Download
			const link = document.createElement('a');
			link.download = `${posterData.artist} - ${posterData.title} - Poster.jpg`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error('Error creating poster:', error);
		} finally {
			isCreatingPoster = false;
		}
	}
</script>

<button
	class="btn btn-circle btn-ghost"
	on:click={createPoster}
	disabled={isCreatingPoster}
	aria-label="Download poster"
>
	{#if isCreatingPoster}
		<LoaderCircle class="h-6 w-6 animate-spin" />
	{:else}
		<Download class="h-6 w-6" />
	{/if}
</button>
