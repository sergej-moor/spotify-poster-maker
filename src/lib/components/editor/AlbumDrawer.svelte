<script>
	import { Drawer } from 'vaul-svelte';
	import { Disc3 } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import AlbumContent from './content/AlbumContent.svelte';

	const dispatch = createEventDispatcher();

	function handleOpenChange(isOpen) {
		dispatch('openChange', isOpen);
	}
</script>

<Drawer.Root onOpenChange={handleOpenChange}>
	<Drawer.Trigger
		class={`btm-nav-item ${$$props.isActive ? 'active' : ''}`}
		on:click={() => dispatch('click')}
	>
		<div class="flex flex-col items-center">
			<Disc3 />
			<span class="btm-nav-label">Album</span>
		</div>
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-fit  flex-col rounded-t-[10px] bg-gray-100"
		>
			<div class="flex-1 rounded-t-[10px] bg-white p-4">
				<AlbumContent />
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
