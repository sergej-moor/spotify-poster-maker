<!-- This component will only be used for rendering the poster -->
<script>
	import { Dot } from 'lucide-svelte';
	import { posterStore } from '$lib/stores/poster';
	import { calculateTitleLayout } from '$lib/utils/sanitizers/titleLayoutUtils';

	/** @type {number} */
	export let width;
	/** @type {number} */
	export let height;
	/** @type {boolean} */
	export let isPlaceholder = false;
	/** @type {import('$lib/types/poster').PosterData | undefined} */
	export let data = undefined;

	// Use store data if no direct data is provided
	$: posterData = data || $posterStore.posterData;
	$: songsPerColumn = Math.ceil(posterData.tracks?.filter((t) => t.visible).length / 2);

	/** @type {number} */
	let titleFontSize;
	/** @type {boolean} */
	let isTwoLines;
	/** @type {string} */
	let formattedTitle;

	$: {
		const layout = calculateTitleLayout(posterData.title);
		titleFontSize = layout.fontSize;
		isTwoLines = layout.isTwoLines;
		formattedTitle = layout.formattedText;
	}
</script>

<div
	id="poster"
	class="font-oswald flex h-full w-full select-none flex-col justify-between border border-black p-24"
	style="
		width: {width}px; 
		height: {height}px;
		background-color: {posterData.backgroundColor};
		color: {posterData.foregroundColor};
	"
>
	<section class="">
		<div class="aspect-square relative w-full">
			<img
				src={posterData.cover}
				alt={posterData.title}
				class="pointer-events-none h-full w-full select-none object-cover"
				draggable="false"
			/>
		</div>
		<div class="my-6 flex items-center justify-between font-bold uppercase">
			<div class="flex-1 text-left">
				<div
					style="font-size: {titleFontSize}rem;"
					class={`${isTwoLines ? 'leading-none' : 'leading-tight'}`}
				>
					<div class="whitespace-pre-wrap break-words">
						{formattedTitle}
					</div>
				</div>
			</div>
			<img
				src={posterData.spotifyCode}
				alt="Spotify Code"
				class="pointer-events-none ml-4 h-28 select-none"
				draggable="false"
			/>
		</div>
		<div class="h-2 w-full" style="background-color: {posterData.foregroundColor};"></div>
	</section>

	<section class="mt-12 grid grid-cols-3 items-center overflow-hidden text-[2.25rem]">
		<div class="col-span-1 flex h-80 flex-col items-start justify-between">
			{#if isPlaceholder}
				<!-- Placeholder rectangles for album info -->
				<div class="flex flex-col items-start leading-snug">
					<p
						class="my-2 h-[1.75rem] w-40 rounded-sm"
						style="background-color: {posterData.foregroundColor};"
					></p>
					<div class="flex items-center">
						<Dot class="-mr-1 h-12 w-12" />
						<div
							class="my-2 h-[1.75rem] w-24 rounded-sm"
							style="background-color: {posterData.foregroundColor};"
						></div>
					</div>
				</div>
				<div class="flex flex-col items-start leading-snug">
					<p
						class="my-2 h-[1.75rem] w-40 rounded-sm"
						style="background-color: {posterData.foregroundColor};"
					></p>
					<div class="flex items-center">
						<Dot class="-mr-1 h-12 w-12" />
						<div
							class="my-2 h-[1.75rem] w-32 rounded-sm"
							style="background-color: {posterData.foregroundColor};"
						></div>
					</div>
				</div>
				<div class="flex flex-col items-start leading-snug">
					<p
						class="my-2 h-[1.75rem] w-32 rounded-sm"
						style="background-color: {posterData.foregroundColor};"
					></p>
					<div class="flex items-center">
						<Dot class="-mr-1 h-12 w-12" />
						<div
							class="my-2 h-[1.75rem] w-44 rounded-sm"
							style="background-color: {posterData.foregroundColor};"
						></div>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-start leading-snug">
					<p>Release Year</p>
					<p class="flex items-center"><Dot class="-mr-1 h-12 w-12" /> {posterData.releaseYear}</p>
				</div>
				<div class="flex flex-col items-start leading-snug">
					<p>Duration</p>
					<p class="flex items-center">
						<Dot class="-mr-1 h-12 w-12" />
						{posterData.totalDuration}
					</p>
				</div>
				<div class="flex flex-col items-start leading-snug">
					<p>Genre</p>
					<p class="flex items-center"><Dot class="-mr-1 h-12 w-12" /> {posterData.genre}</p>
				</div>
			{/if}
		</div>

		<div class="col-span-2">
			<ul class="grid auto-cols-fr grid-flow-col gap-8">
				{#each Array(Math.ceil(posterData.tracks.filter((t) => t.visible).length / songsPerColumn)) as _, colIndex}
					<div class="flex flex-col leading-snug">
						{#each posterData.tracks
							.filter((t) => t.visible)
							.slice(colIndex * songsPerColumn, (colIndex + 1) * songsPerColumn) as track, index}
							<li class="flex gap-2">
								{#if isPlaceholder}
									<!-- Placeholder rectangle for track name -->
									<div
										class="my-2 h-[1.75rem] rounded-sm"
										style="
											background-color: {posterData.foregroundColor}; 
											
											width:{20 + Math.random() * 40}%;
										"
									></div>
								{:else}
									{(colIndex * songsPerColumn + index + 1).toString().padStart(2, '0')}.
									<div style="color: {posterData.foregroundColor};">{track.name}</div>
								{/if}
							</li>
						{/each}
					</div>
				{/each}
			</ul>
		</div>
	</section>

	<section class="grid grid-cols-3 items-end gap-12">
		<div class="flex">
			{#each posterData.colors ?? [] as color}
				<div class="h-16 w-32" style="background-color: {color};"></div>
			{/each}
		</div>
		<div class="col-span-2">
			<h2 class="text-right text-[4rem] font-bold uppercase">{posterData.artist}</h2>
			<div class="h-2 w-full" style="background-color: {posterData.foregroundColor};"></div>
		</div>
	</section>
</div>
