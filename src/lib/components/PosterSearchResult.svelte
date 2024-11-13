<script>
	import { goto } from '$app/navigation';
	import Poster from './Poster.svelte';
	import { onMount } from 'svelte';
	import { extractColors, getTintedSpotifyCode, posterStore } from '$lib/stores/poster';
	import { sanitizeTitle } from '$lib/utils/sanitizers/titleSanitizer';

	/** @type {import('$lib/types/spotify').SpotifyAlbum} */
	export let album;
	/** @type {'grid' | 'list'} */
	export let viewMode;

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

	let isDragging = false;
	let startX = 0;
	let startY = 0;

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

	/**
	 * Sanitize the album title
	 * @param {string} title
	 * @returns {string}
	 */
	function getSanitizedTitle(title) {
		const { sanitized } = sanitizeTitle(title);
		return sanitized;
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
				title: getSanitizedTitle(album.name) || '',
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
		// Push the calculation to the next event loop
		setTimeout(() => {
			if (container) {
				const containerWidth = container.parentElement?.clientWidth || window.innerWidth;
				posterScaling = containerWidth / size.x;
			}
		}, 0);
	}

	$: scaledWidth = Math.round(size.x * posterScaling);
	$: scaledHeight = Math.round(size.y * posterScaling);

	// Watch for viewMode changes and update scale
	$: viewMode, updateScale();

	onMount(() => {
		initializePreviewData();
		updateScale(); // Initial scale calculation

		const handleResize = () => {
			updateScale();
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	/**
	 * @param {MouseEvent} event
	 */
	function handleMouseDown(event) {
		isDragging = false;
		startX = event.clientX;
		startY = event.clientY;
	}

	/**
	 * @param {MouseEvent} event
	 */
	function handleMouseMove(event) {
		if (Math.abs(event.clientX - startX) > 5 || Math.abs(event.clientY - startY) > 5) {
			isDragging = true;
		}
	}

	/**
	 * @param {MouseEvent} event
	 */
	function handleClick(event) {
		if (isDragging) {
			return;
		}

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
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
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
