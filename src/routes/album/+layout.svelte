<script>
	import { Disc3, DiscAlbum, Download, ListMusic, Palette } from 'lucide-svelte';
	import '../../app.css';
	let { children } = $props();
	import Search from 'lucide-svelte/icons/search';
	import BottomMenu from '$lib/components/editor/BottomMenu.svelte';
	import SideMenu from '$lib/components/editor/SideMenu.svelte';
</script>

<div class="flex h-screen flex-col overflow-hidden">
	<nav class="border border-b-primary px-4 py-2 md:px-8">
		<div class="mx-auto flex items-center justify-between lg:max-w-6xl">
			<a class="block font-bold leading-[0.9] text-primary lg:hidden" href="/">
				Your <br />
				Album <br />
				Poster <br />
			</a>
			<a class="hidden text-lg font-bold text-primary lg:block" href="/"> Your Album Poster </a>

			<button>
				<Download />
			</button>
		</div>
	</nav>

	<div class="flex flex-1 overflow-hidden">
		<SideMenu />
		<div class="mx-4 my-2 flex-1 overflow-auto md:mx-8 lg:mx-auto lg:my-16 lg:max-w-6xl">
			{@render children()}
		</div>
		<BottomMenu />
	</div>
</div>
