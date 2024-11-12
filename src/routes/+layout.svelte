<script>
	import '../app.css';
	let { children } = $props();
	import Search from 'lucide-svelte/icons/search';
</script>

<nav class=" flex items-center justify-between border border-b-primary px-4 py-2">
	<a class="block font-bold leading-[0.9] text-primary" href="/">
		Your <br />
		Album <br />
		Poster <br />
	</a>
	<a class="block rounded-full border border-primary p-2 text-primary" href="/search">
		<Search size={16}></Search>
	</a>
</nav>
<div class="mx-4 my-2">
	{@render children()}
</div>
<footer></footer>
