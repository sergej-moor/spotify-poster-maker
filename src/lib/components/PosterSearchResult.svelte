<script>
	import { goto } from '$app/navigation';
	import Poster from './Poster.svelte';
	import { onMount } from 'svelte';
	import { extractColors, getTintedSpotifyCode, posterStore } from '$lib/stores/poster';

	/**
	 * @typedef {Object} SpotifyAlbum
	 * @property {string} id
	 * @property {string} name
	 * @property {Array<{url: string}>} images
	 * @property {Array<{name: string}>} artists
	 * @property {string} release_date
	 * @property {number} total_tracks
	 */
	/** @type {SpotifyAlbum} */
	export let album;

	// Get themes from the poster store
	const themes = posterStore.getThemes();
	const theme = themes[Math.floor(Math.random() * themes.length)];

	/** @type {HTMLElement} */
	let container;
	let posterScaling = 1;
	const size = { x: 2480, y: 3508 }; // A4 at 300 DPI
	/** @type {import('$lib/stores/poster').PosterData | null} */
	let previewData = null;
	let loading = true;

	/**
	 * @param {number} totalTracks
	 * @returns {import('$lib/stores/poster').Track[]}
	 */
	function generatePlaceholderTracks(totalTracks) {
		return Array.from({ length: totalTracks }, (_, index) => ({
			name: `Track ${(index + 1).toString().padStart(2, '0')}`,
			duration_ms: 180000, // 3 minutes as placeholder
			visible: index < 22 // Only show first 22 tracks
		}));
	}

	async function initializePreviewData() {
		try {
			// Extract colors from album cover
			const colors = await extractColors(album.images[0]?.url);

			// Get tinted Spotify code
			const spotifyCode = await getTintedSpotifyCode(album.id, theme.background, theme.foreground);

			// Create preview data with placeholder values
			previewData = {
				cover: album.images[0]?.url || '',
				title: album.name || '',
				artist: album.artists[0]?.name || '',
				releaseDate: album.release_date || '',
				tracks: generatePlaceholderTracks(album.total_tracks),
				totalDuration: '45:00', // Placeholder duration
				releaseYear: album.release_date?.split('-')[0] || '',
				genre: 'Loading...', // Placeholder genre
				spotifyCode,
				albumId: album.id,
				colors: colors.slice(0, 5),
				backgroundColor: theme.background,
				foregroundColor: theme.foreground
			};
		} catch (error) {
			console.error('Error initializing preview:', error);
		} finally {
			loading = false;
		}
	}

	function updateScale() {
		if (container) {
			const containerWidth = container.parentElement?.clientWidth || window.innerWidth;
			posterScaling = containerWidth / size.x;
		}
	}

	$: scaledWidth = Math.round(size.x * posterScaling);
	$: scaledHeight = Math.round(size.y * posterScaling);

	onMount(() => {
		initializePreviewData();
		updateScale();
		window.addEventListener('resize', updateScale);
		return () => window.removeEventListener('resize', updateScale);
	});

	/**
	 * @param {MouseEvent} event
	 */
	function handleClick(event) {
		if (previewData) {
			posterStore.setTheme({
				backgroundColor: theme.background,
				foregroundColor: theme.foreground,
				colors: previewData.colors
			});
		}

		if (event.button === 1) {
			event.preventDefault();
			window.open(`/album/${album.id}`, '_blank');
		} else {
			goto(`/album/${album.id}`);
		}
	}
</script>

<button
	on:click={handleClick}
	on:mouseup={handleClick}
	class="hover:scale-102 w-full transition-transform focus:outline-none"
>
	<div
		bind:this={container}
		class="overflow-hidden drop-shadow-lg"
		style="width: {scaledWidth}px; height: {scaledHeight}px;"
	>
		{#if loading}
			<div class="skeleton flex h-full w-full items-center justify-center"></div>
		{:else if previewData}
			<div style="transform: scale({posterScaling}); transform-origin: top left;">
				<Poster width={size.x} height={size.y} isPlaceholder={true} data={previewData} />
			</div>
		{/if}
	</div>
</button>
