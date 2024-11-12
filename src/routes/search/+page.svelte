<script>
	import { Search, Grid, List } from 'lucide-svelte';
	import PosterSearchResult from '$lib/components/PosterSearchResult.svelte';

	/** @type {string} */
	let query = 'bob marley';
	/** @type {import('$lib/types/spotify').SpotifyAlbum[]} */
	let albumResults = [];
	/** @type {boolean} */
	let isSearching = false;
	/** @type {'grid' | 'list'} */
	let viewMode = 'list';

	/** @type {string[]} */
	const defaultSearches = [
		'The Doors',
		'Tame Impala',
		'Pink Floyd',
		'Bob Marley',
		'Kendrick Lamar',
		'David Bowie',
		'Queen',
		'Miles Davis',
		'Radiohead',
		'Nina Simone',
		'Bad Bunny',
		'BTS',
		'Björk',
		'Prince',
		'Stevie Wonder',
		'Daft Punk',
		'Beyoncé',
		'The Beatles',
		'Nirvana',
		'Bob Dylan',
		'Frank Ocean',
		'ABBA',
		'Santana',
		'Led Zeppelin',
		'Fleetwood Mac',
		'Michael Jackson',
		'Aretha Franklin',
		'Coldplay',
		'Jay-Z',
		'Red Hot Chili Peppers'
	];

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
	<div>{albumResults.length} results</div>
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
		<h2>Search results</h2>

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
		<p class="text-bold mt-4 text-3xl">no albums found :(</p>
	{/if}
</div>
