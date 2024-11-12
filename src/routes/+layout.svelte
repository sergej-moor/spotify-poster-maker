<script>
	import '../app.css';
	let { children } = $props();
	import Search from 'lucide-svelte/icons/search';
</script>

<nav class="  border border-b-primary px-4 py-2 md:px-8 lg:px-16">
	<div class="mx-auto flex items-center justify-between lg:max-w-6xl">
		<a class="block font-bold leading-[0.9] text-primary lg:hidden" href="/">
			Your <br />
			Album <br />
			Poster <br />
		</a>
		<a class=" hidden text-lg font-bold text-primary lg:block" href="/"> Your Album Poster </a>
		<a
			class="flex items-center gap-2 rounded-full border border-primary p-2 px-4 text-primary"
			href="/search"
		>
			<span>Search</span>
			<Search size={14}></Search>
		</a>
	</div>
</nav>
<div class="flex justify-center">
	<div class="mx-4 my-2 grow md:mx-8 lg:mx-16 lg:my-16 lg:max-w-6xl">
		{@render children()}
	</div>
</div>
<footer></footer>
