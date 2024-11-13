<script>
	import { DiscAlbum } from 'lucide-svelte';
	import '../../app.css';
	let { children } = $props();
	import Search from 'lucide-svelte/icons/search';
</script>

<div class="flex min-h-screen flex-col">
	<nav class="border border-b-primary px-4 py-2 md:px-8 lg:px-16">
		<div class="mx-auto flex items-center justify-between lg:max-w-6xl">
			<a class="block font-bold leading-[0.9] text-primary lg:hidden" href="/">
				Your <br />
				Album <br />
				Poster <br />
			</a>
			<a class="hidden text-lg font-bold text-primary lg:block" href="/"> Your Album Poster </a>
			<a
				class="flex items-center gap-2 rounded-full border border-primary p-2 px-4 text-primary"
				href="/search"
			>
				<span>Search</span>
				<Search size={14} />
			</a>
		</div>
	</nav>

	<main class="flex flex-1 justify-center">
		<div class="mx-4 my-2 grow md:mx-8 lg:mx-16 lg:my-16 lg:max-w-6xl">
			{@render children()}
		</div>
	</main>

	<footer class="items-center bg-neutral p-4 text-neutral-content md:px-8 lg:px-16">
		<div class="footer mx-auto flex items-center justify-between lg:max-w-6xl">
			<aside class="grid-flow-col items-center">
				<a class="flex items-center gap-2 font-bold leading-[1]" href="/">
					<DiscAlbum />
				</a>
				<!-- 	<p>Copyright © {new Date().getFullYear()} - No right reserved</p> -->
			</aside>
			<nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
				<a href="/imprint">Imprint</a>
				<!-- <a href="/about">About</a> -->
			</nav>
		</div>
	</footer>
</div>
