<script>
	import { Drawer } from 'vaul-svelte';
	import { Palette } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<Drawer.Root>
	<Drawer.Trigger
		class={`btm-nav-item ${$$props.isActive ? 'active' : ''}`}
		on:click={() => dispatch('click')}
	>
		<div class="flex flex-col items-center">
			<Palette />
			<span class="btm-nav-label">Palette</span>
		</div>
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay class="fixed inset-0 bg-black/40" />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-[90%] flex-col rounded-t-[10px] bg-gray-100"
		>
			<div class="flex-1 rounded-t-[10px] bg-white p-4">
				<h2 class="text-xl font-bold">Color Palette</h2>
				<section
					data-vaul-no-drag
					class="grid min-h-16 place-items-center gap-4 rounded-lg bg-gray-100 p-4"
				></section>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
