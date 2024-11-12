<script>
	import { Search, Grid, List } from 'lucide-svelte';
	import PosterSearchResult from '$lib/components/PosterSearchResult.svelte';
	import { featuredAlbums } from '$lib/data/featuredAlbums';
	import { shuffleArray } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {string} */
	let query = '';
	/** @type {import('$lib/types/spotify').SpotifyAlbum[]} */
	let albumResults = [];
	/** @type {boolean} */
	let isSearching = false;
	/** @type {'grid' | 'list'} */
	let viewMode = 'list';

	/**
	 * Search for albums using the Spotify API
	 * @param {string} searchQuery - The search query to use
	 * @returns {Promise<void>}
	 */
	async function searchAlbums(searchQuery) {
		if (!searchQuery) return;

		isSearching = true;
		albumResults = [];

		try {
			const res = await fetch(`/api/spotify/search?query=${encodeURIComponent(searchQuery)}`);
			if (res.ok) {
				/** @type {{ albums: { items: import('$lib/types/spotify').SpotifyAlbum[] }}} */
				const data = await res.json();
				albumResults = data.albums.items.filter(
					(album) => album.total_tracks > 1 && album.total_tracks <= 50
				);
				console.log(albumResults);
			} else {
				console.error('Failed to fetch search results');
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

	/** @type {import('$lib/types/spotify').SpotifyAlbum[]} */
	let shuffledAlbums = [];

	onMount(() => {
		shuffledAlbums = shuffleArray(featuredAlbums);
	});
</script>

<h1 class="text-4xl font-bold">Album search</h1>
<p>Just one step away from your poster!</p>

<div class="flex items-center justify-between gap-4">
	<div class="flex flex-1 items-center justify-between gap-2 border-b border-primary">
		<input
			bind:value={query}
			type="text"
			class="input grow focus:border-none focus:outline-none"
			placeholder="Search an album"
			on:keydown={handleKeydown}
		/>

		<button on:click={() => searchAlbums(query)} class="btn btn-circle btn-primary btn-sm">
			<Search size={14} />
		</button>
	</div>
</div>
<div class="my-2 flex justify-between">
	{#if !isSearching && albumResults.length > 0}
		<div>{albumResults.length} results</div>
	{/if}
	<div></div>
	<div class="flex gap-2">
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
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if albumResults.length > 0}
		<h2 class="mb-4 text-2xl font-bold">Search results</h2>
		<ul
			class="grid w-full gap-4 {viewMode === 'list'
				? 'w-full grid-cols-1'
				: 'grid-cols-2  sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6'}"
		>
			{#each albumResults as album (album.id)}
				<li>
					<PosterSearchResult {album} {viewMode} />
				</li>
			{/each}
		</ul>
	{:else}
		<div class="space-y-8">
			<h2 class="mb-4 text-2xl font-bold">Featured albums</h2>
			<ul
				class="grid w-full gap-4 {viewMode === 'list'
					? 'w-full grid-cols-1'
					: 'grid-cols-2  sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6'}"
			>
				{#each shuffledAlbums as album (album.id)}
					<li>
						<PosterSearchResult {album} {viewMode} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
