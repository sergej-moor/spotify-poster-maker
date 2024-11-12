<script>
	import { Search } from 'lucide-svelte';
	import Poster from '../../components/Poster.svelte';
</script>

<h1 class="text-4xl font-bold">Album search</h1>
<p>Just one step away from your poster!</p>
<label class="input input-bordered flex items-center gap-2">
	<input type="text" class="grow border-0 focus:border-0" placeholder="Search an album" />

	<Search></Search>
</label>

<div>20 results</div>

<ul class="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6">
	{#each Array(20) as _, i}
		<li><Poster key={i}></Poster></li>
	{/each}
</ul>
