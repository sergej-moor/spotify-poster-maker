<script>
	import { Search } from 'lucide-svelte';
	import Poster from '../../components/Poster.svelte';

	let query = 'bob marley';
	let albumResults = [];
	let isSearching = false;

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

	async function searchAlbums(searchQuery) {
		if (!searchQuery) return;

		isSearching = true;
		albumResults = [];

		try {
			const res = await fetch(`/api/spotify/search?query=${encodeURIComponent(searchQuery)}`);
			if (res.ok) {
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

	/* 	async function searchAlbums(searchQuery) {
		if (!searchQuery) return;

		isSearching = true;
		albumResults = [];

		const response = await fetch(`/api/spotify/search?query=${encodeURIComponent(searchQuery)}`);
		const data = await response.json();
		albumResults = data.albums.items;
	} */
</script>

<h1 class="text-4xl font-bold">Album search</h1>
<p>Just one step away from your poster!</p>
<div class=" flex items-center justify-between gap-2 border-b border-primary">
	<input
		bind:value={query}
		type="text"
		class="input grow focus:border-none focus:outline-none"
		placeholder="Search an album"
		on:keydown={(e) => e.key === 'Enter' && searchAlbums(query)}
	/>

	<button on:click={() => searchAlbums(query)} class="btn btn-circle btn-primary btn-sm">
		<Search size={14}></Search>
	</button>
</div>

<div>20 results</div>
{#if albumResults.length > 0}
	<ul>
		{#each albumResults as album}
			<li>
				<img src={album.images[0]?.url} alt={album.name} width="100" />
				<h3>{album.name}</h3>
				<p>by {album.artists.map((a) => a.name).join(', ')}</p>
			</li>
		{/each}
	</ul>
{:else}
	<p>No albums found</p>
{/if}
<ul class="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6">
	{#each Array(20) as _, i}
		<li><Poster key={i}></Poster></li>
	{/each}
</ul>
