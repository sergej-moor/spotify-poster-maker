<script>
	import { DiscAlbum, Music, Palette, ArrowRight, Search, PencilRuler } from 'lucide-svelte';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import { featuredAlbums } from '$lib/data/featuredAlbums';
	import { onMount } from 'svelte';
	import Poster from '$lib/components/Poster.svelte';
	import PosterSearchResult from '$lib/components/PosterSearchResult.svelte';

	const carouselOptions = { loop: true };
	const carouselPlugins = [Autoplay({ delay: 2000, stopOnInteraction: false })];

	// Prepare featured albums for display
	$: featuredPosters = featuredAlbums.slice(0, 10); // Limit to 5 posters for better performance
</script>

<div class=" flex flex-col gap-16 py-8 md:py-16">
	<!-- Hero Section -->
	<section class="mx-4 text-center">
		<h1 class="mb-4 text-4xl font-bold text-primary md:text-6xl">Create Beautiful Album Posters</h1>
		<p class="mx-auto mb-8 max-w-2xl text-lg text-base-content/80">
			Transform your favorite albums into stunning visual art. Create, customize, and download
			high-quality album posters in minutes.
		</p>
		<a href="/search" class="btn btn-primary btn-lg gap-2">
			Start Creating <ArrowRight class="h-5 w-5" />
		</a>
	</section>

	<!-- Featured Posters Carousel -->
	<section class=" w-screen overflow-hidden lg:w-auto">
		<!-- 	<h2 class="mb-8 text-center text-3xl font-bold">Featured Posters</h2> -->
		<div
			class="embla pl-4"
			use:emblaCarouselSvelte={{ options: carouselOptions, plugins: carouselPlugins }}
		>
			<div class="embla__container">
				{#each featuredPosters as album}
					<div class="embla__slide px-4">
						<div class="relative mx-auto aspect-[1/1.4] w-full max-w-sm">
							<PosterSearchResult {album} viewMode="list" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="mx-4 grid gap-8 md:grid-cols-3">
		<div class="card bg-base-200">
			<div class="card-body items-center text-center">
				<Music class="h-12 w-12 text-primary" />
				<h2 class="card-title">Vast Library</h2>
				<p>
					Access millions of albums through Spotify's extensive music catalog to create your perfect
					poster.
				</p>
			</div>
		</div>

		<div class="card bg-base-200">
			<div class="card-body items-center text-center">
				<PencilRuler class="h-12 w-12 text-primary" />
				<h2 class="card-title">Customize</h2>
				<p>
					Customize album information, genre tags, and arrange your track list exactly how you want
					it.
				</p>
			</div>
		</div>

		<div class="card bg-base-200">
			<div class="card-body items-center text-center">
				<Palette class="h-12 w-12 text-primary" />
				<h2 class="card-title">Theming</h2>
				<p>
					Choose from a variety of carefully crafted color themes to match your album's aesthetic.
				</p>
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="mx-4 text-center">
		<h2 class="mb-8 text-3xl font-bold">How It Works</h2>
		<div class="steps steps-vertical md:steps-horizontal">
			<div class="step step-primary">Search for an album</div>
			<div class="step step-primary">Customize your poster</div>
			<div class="step step-primary">Download high-quality image</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="card mx-4 bg-primary text-primary-content">
		<div class="card-body items-center text-center">
			<h2 class="card-title text-2xl">Ready to Create Your Poster?</h2>
			<p class="mb-4">Start designing your custom album poster now - it's free!</p>
			<a href="/search" class="btn btn-secondary gap-2">
				Get Started <ArrowRight class="h-5 w-5" />
			</a>
		</div>
	</section>
</div>

<style>
	.embla {
		--slide-spacing: 1rem;
		--slide-size: 100%;
		--slide-height: auto;
	}
	.embla__container {
		backface-visibility: hidden;
		display: flex;
		touch-action: pan-y;
		margin-left: calc(var(--slide-spacing) * -1);
	}
	.embla__slide {
		flex: 0 0 var(--slide-size);
		min-width: 0;
		padding-left: var(--slide-spacing);
		position: relative;
	}
	@media (min-width: 1224px) {
		.embla {
			--slide-size: 33.33%;
		}
	}
</style>
