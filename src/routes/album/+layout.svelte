<script>
	import '../../app.css';
	let { children } = $props();
	import Search from 'lucide-svelte/icons/search';
	import BottomMenu from '$lib/components/editor/BottomMenu.svelte';
	import SideMenu from '$lib/components/editor/SideMenu.svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import { DiscAlbum } from 'lucide-svelte';
</script>

<div class="flex h-screen flex-col overflow-hidden">
	<nav class="border border-b-primary px-4 py-2">
		<div class="mx-auto flex items-center justify-between sm:mx-12">
			<a class=" flex items-center text-lg font-bold text-primary" href="/">
				<DiscAlbum /> Postify
			</a>

			<DownloadButton />
		</div>
	</nav>

	<div class="flex flex-1">
		<SideMenu />
		<div
			class="mx-4 my-2 mt-8 flex-1 overflow-auto px-4 sm:mt-0 sm:self-center md:mx-8 lg:mx-auto lg:max-w-6xl"
		>
			{@render children()}
		</div>
		<BottomMenu />
	</div>
</div>
