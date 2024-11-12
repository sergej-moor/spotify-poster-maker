<script>
	import { Disc3, ListMusic, Palette } from 'lucide-svelte';

	/** @type {'album' | 'tracks' | 'palette'} */
	let activeTab = 'tracks';

	function setActiveTab(tab) {
		activeTab = tab;
	}
</script>

<div class="btm-nav md:hidden">
	<button class={activeTab === 'album' ? 'active' : ''} on:click={() => setActiveTab('album')}>
		<Disc3 />
		<span class="btm-nav-label">Album</span>
	</button>
	<button class={activeTab === 'tracks' ? 'active' : ''} on:click={() => setActiveTab('tracks')}>
		<ListMusic />
		<span class="btm-nav-label">Tracks</span>
	</button>
	<button class={activeTab === 'palette' ? 'active' : ''} on:click={() => setActiveTab('palette')}>
		<Palette />
		<span class="btm-nav-label">Palette</span>
	</button>
</div>
