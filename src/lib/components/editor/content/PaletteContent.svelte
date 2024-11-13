<script>
	import { posterStore } from '$lib/stores/poster';

	const themes = posterStore.getThemes();

	function selectTheme(theme) {
		posterStore.setTheme(theme);
		posterStore.updatePosterData({
			backgroundColor: theme.background,
			foregroundColor: theme.foreground
		});
	}
</script>

<div class="space-y-4">
	<h2 class="text-xl font-bold">Color Palette</h2>
	<div class="grid gap-2">
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
						/>
						<div
							class="h-6 w-6 rounded-full border"
							style="background-color: {theme.foreground}; border-color: {theme.background}"
						/>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>
