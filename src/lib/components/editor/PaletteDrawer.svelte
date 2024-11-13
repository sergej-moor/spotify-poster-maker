<script>
	import { Drawer } from 'vaul-svelte';
	import { Palette } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { posterStore } from '$lib/stores/poster';

	const dispatch = createEventDispatcher();
	const themes = posterStore.getThemes();

	function selectTheme(theme) {
		posterStore.setTheme(theme);
		posterStore.updatePosterData({
			backgroundColor: theme.background,
			foregroundColor: theme.foreground
		});
	}

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
			<Palette />
			<span class="btm-nav-label">Palette</span>
		</div>
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-fit flex-col rounded-t-[10px] bg-gray-100"
		>
			<div class="flex-1 rounded-t-[10px] bg-white p-4">
				<h2 class="mb-4 text-center text-xl font-bold">Color Palette</h2>
				<section data-vaul-no-drag class="grid grid-cols-2 gap-2 rounded-lg p-4">
					{#each themes as theme}
						<button
							class="flex items-center gap-4 rounded-lg border p-2 hover:bg-gray-50"
							style="background-color: {theme.background}; color: {theme.foreground}; border-color: {theme.foreground}"
							on:click={() => selectTheme(theme)}
						>
							<div class="flex flex-1 items-center justify-between">
								<span class="font-medium">{theme.name}</span>
								<div class="flex gap-2">
									<div
										class="h-6 w-6 rounded-full border"
										style="background-color: {theme.background}; border-color: {theme.foreground}"
									></div>
									<div
										class="h-6 w-6 rounded-full border"
										style="background-color: {theme.foreground}; border-color: {theme.background}"
									></div>
								</div>
							</div>
						</button>
					{/each}
				</section>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
