<script>
	import { Search, Grid, List } from 'lucide-svelte';
	import PosterSearchResult from '$lib/components/PosterSearchResult.svelte';
	import { featuredAlbums } from '$lib/data/featuredAlbums';
	import { shuffleArray } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {string} */
	let query = '';
	/** @type {import('$lib/types/spotify').SpotifyAlbum[]} */
	let allAlbums = [];
	/** @type {import('$lib/types/spotify').SpotifyAlbum[]} */
	let visibleAlbums = [];
	/** @type {boolean} */
	let isSearching = false;
	/** @type {'grid' | 'list'} */
	let viewMode = 'grid';
	/** @type {HTMLElement | null} */
	let loadMoreTrigger;
	const ITEMS_PER_PAGE = 6;
	let currentPage = 1;

	/** @type {IntersectionObserver | null} */
	let observer = null;

	function loadMoreAlbums() {
		const start = 0;
		const end = currentPage * ITEMS_PER_PAGE;
		visibleAlbums = allAlbums.slice(start, end);
	}

	function setupObserver() {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && visibleAlbums.length < allAlbums.length) {
						currentPage++;
						loadMoreAlbums();
					}
				});
			},
			{
				root: null,
				rootMargin: '100px',
				threshold: 0.1
			}
		);
	}

	function attachObserver() {
		if (loadMoreTrigger && observer) {
			observer.observe(loadMoreTrigger);
		}
	}

	$: if (loadMoreTrigger) {
		attachObserver();
	}

	/**
	 * Search for albums using the Spotify API
	 * @param {string} searchQuery - The search query to use
	 * @returns {Promise<void>}
	 */
	async function searchAlbums(searchQuery) {
		if (!searchQuery) {
			allAlbums = shuffleArray(featuredAlbums);
			currentPage = 1;
			loadMoreAlbums();
			return;
		}

		isSearching = true;
		try {
			const res = await fetch(`/api/spotify/search?query=${encodeURIComponent(searchQuery)}`);
			if (res.ok) {
				/** @type {{ albums: { items: import('$lib/types/spotify').SpotifyAlbum[] }}} */
				const data = await res.json();
				allAlbums = data.albums.items.filter(
					(album) => album.total_tracks > 1 && album.total_tracks <= 50
				);
				currentPage = 1;
				loadMoreAlbums();
			}
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			isSearching = false;
		}
	}

	/**
	 * Handle keydown event for search input
	 * @param {KeyboardEvent} e
	 */
	function handleKeydown(e) {
		if (e.key === 'Enter') {
			searchAlbums(query);
		}
	}

	onMount(() => {
		allAlbums = shuffleArray(featuredAlbums);
		loadMoreAlbums();
		setupObserver();

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
</script>

<h1 class="mt-6 text-4xl font-bold">Album search</h1>
<p>Just one step away from your poster!</p>

<div class="flex items-center justify-between gap-4">
	<div class="my-4 flex flex-1 items-center justify-between gap-2 border-b border-primary pb-1">
		<input
			bind:value={query}
			type="text"
			class="input my-1 h-fit grow p-0 text-lg focus:border-transparent focus:outline-none"
			placeholder="Search an album"
			on:keydown={handleKeydown}
		/>

		<button on:click={() => searchAlbums(query)} class="btn btn-circle btn-primary btn-sm">
			<Search size={14} />
		</button>
	</div>
</div>
<div class="my-2 flex justify-between">
	{#if !isSearching && allAlbums.length > 0}
		<div>{allAlbums.length} results</div>
	{:else}
		<div></div>
	{/if}

	<div class="flex gap-2 sm:hidden">
		<button
			class="btn btn-circle btn-sm {viewMode === 'grid' ? 'btn-active' : ''}"
			on:click={() => (viewMode = 'grid')}
		>
			<Grid size={14} />
		</button>
		<button
			class="btn btn-circle btn-sm {viewMode === 'list' ? 'btn-active' : ''}"
			on:click={() => (viewMode = 'list')}
		>
			<List size={14} />
		</button>
	</div>
</div>

<div class="w-full">
	{#if isSearching}
		<p>Loading results...</p>
		<div class="flex h-96 w-full items-center justify-center">
			<span class="loading loading-spinner loading-lg" />
		</div>
	{:else}
		<div class="mt-6 space-y-8">
			<ul
				class="grid w-full gap-4 {viewMode === 'list'
					? ' grid-cols-1 '
					: 'grid-cols-2  sm:grid-cols-3  lg:grid-cols-4'}"
			>
				{#each visibleAlbums as album (album.id)}
					<li>
						<PosterSearchResult {album} {viewMode} />
					</li>
				{/each}
			</ul>

			{#if visibleAlbums.length < allAlbums.length}
				<div bind:this={loadMoreTrigger} class="mt-8 flex h-20 w-full items-center justify-center">
					<span class="loading loading-spinner loading-md" />
				</div>
			{/if}
		</div>
	{/if}
</div>
