import { writable } from 'svelte/store';
import ColorThief from 'colorthief';

/**
 * @typedef {Object} PosterStore
 * @property {import('$lib/types/poster').PosterData} posterData
 * @property {import('$lib/types/poster').Dimensions} size
 */

/** @type {import('$lib/types/poster').ColorTheme[]} */
const DEFAULT_THEMES = [
	{ name: 'Classic', background: '#FFFFFF', foreground: '#000000' },
	{ name: 'Dark', background: '#000000', foreground: '#FFFFFF' },
	{ name: 'Vintage', background: '#F5F5DC', foreground: '#8B4513' },
	{ name: 'Gold', background: '#1E1E1E', foreground: '#FFD700' },
	{ name: 'Earth', background: '#FAF3E0', foreground: '#2F4F4F' },
	{ name: 'Modern', background: '#2C3E50', foreground: '#E74C3C' },
	{ name: 'Ocean', background: '#F0F8FF', foreground: '#4682B4' },
	{ name: 'Sunset', background: '#FFF5E1', foreground: '#FF6B6B' },
	{ name: 'Wine', background: '#2E1114', foreground: '#EA638C' },
	{ name: 'Minimal', background: '#EEF2F7', foreground: '#1B1B1E' },
	{
		name: 'Navy',
		background: '#0A1929',
		foreground: '#E6EDF3'
	},
	{
		name: 'Forest',
		background: '#1A2F1C',
		foreground: '#F0E6D2'
	},
	{
		name: 'Royal',
		background: '#2D1B69',
		foreground: '#FFD700'
	},
	{
		name: 'Charcoal',
		background: '#1C1C1C',
		foreground: '#FFFFFF'
	}
];

/** @type {PosterStore} */
const DEFAULT_STORE_STATE = {
	posterData: {
		cover: '',
		title: '',
		artist: '',
		releaseDate: '',
		tracks: [{ name: '', duration_ms: 0, visible: true }],
		totalDuration: '0min',
		releaseYear: '',
		genre: '',
		spotifyCode: '',
		albumId: '',
		colors: ['#000000'],
		backgroundColor: DEFAULT_THEMES[0].background,
		foregroundColor: DEFAULT_THEMES[0].foreground
	},
	size: { x: 2480, y: 3508 } // A4 at 300 DPI
};

/**
 * @param {import('$lib/types/poster').Track[]} tracks
 * @returns {string}
 */
function getTotalDuration(tracks) {
	const totalMs = tracks.reduce((acc, track) => acc + track.duration_ms, 0);
	const totalMinutes = Math.floor(totalMs / 60000);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return hours === 0 ? `${minutes}min` : `${hours}h ${minutes}min`;
}

/**
 * @param {string[] | undefined} genres
 * @returns {string}
 */
function formatGenre(genres) {
	if (!genres?.length) return 'Unknown Genre';

	return genres[0]
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * @param {number[]} rgb
 * @returns {string}
 */
function rgbToHex([r, g, b]) {
	return (
		'#' +
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			})
			.join('')
	);
}

/**
 * @param {string} imageUrl
 * @returns {Promise<string[]>}
 */
async function extractColors(imageUrl) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'Anonymous';

		img.onload = () => {
			try {
				const colorThief = new ColorThief();
				const palette = colorThief.getPalette(img, 5);
				resolve(palette.map(rgbToHex));
			} catch (error) {
				reject(error);
			}
		};

		img.onerror = reject;
		img.src = imageUrl;
	});
}

/**
 * @param {string} albumId
 * @param {string} [backgroundColor='FFFFFF']
 * @param {string} [foregroundColor='black']
 * @param {number} [size=640]
 * @returns {Promise<string>}
 */
async function getTintedSpotifyCode(
	albumId,
	backgroundColor = 'FFFFFF',
	foregroundColor = 'black',
	size = 640
) {
	const uri = `spotify:album:${albumId}`;
	const bwCodeUrl = `https://scannables.scdn.co/uri/plain/png/FFFFFF/black/${size}/${uri}`;

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context');

	const img = new Image();
	img.crossOrigin = 'Anonymous';

	return new Promise((resolve, reject) => {
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			const bgColor = hexToRgb(backgroundColor);
			const fgColor = hexToRgb(foregroundColor);

			for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];

				if (r === 0 && g === 0 && b === 0) {
					data[i] = fgColor.r;
					data[i + 1] = fgColor.g;
					data[i + 2] = fgColor.b;
				} else if (r === 255 && g === 255 && b === 255) {
					data[i] = bgColor.r;
					data[i + 1] = bgColor.g;
					data[i + 2] = bgColor.b;
				}
			}

			ctx.putImageData(imageData, 0, 0);
			resolve(canvas.toDataURL('image/png'));
		};

		img.onerror = reject;
		img.src = bwCodeUrl;
	});
}

/**
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number }}
 */
function hexToRgb(hex) {
	const cleanHex = hex.replace('#', '');
	return {
		r: parseInt(cleanHex.substring(0, 2), 16),
		g: parseInt(cleanHex.substring(2, 4), 16),
		b: parseInt(cleanHex.substring(4, 6), 16)
	};
}

function createPosterStore() {
	const { subscribe, set, update } = writable(DEFAULT_STORE_STATE);
	/** @type {{ backgroundColor: string, foregroundColor: string, colors?: string[] } | null} */
	let selectedTheme = null;

	return {
		subscribe,
		/**
		 * @param {{ backgroundColor: string, foregroundColor: string, colors?: string[] }} theme
		 */
		setTheme: (theme) => {
			selectedTheme = theme;
		},
		/**
		 * @param {any} album
		 */
		initialize: async (album) => {
			if (!album?.id) {
				console.error('No album ID provided');
				return;
			}

			const tracks = album.tracks?.items?.map((track, index) => ({
				name: track.name || '',
				duration_ms: track.duration_ms || 0,
				visible: index < 22
			})) || [{ name: '', duration_ms: 0, visible: true }];

			const posterData = {
				cover: album.images[0]?.url || '',
				title: album.name || '',
				artist: album.artists[0]?.name || '',
				releaseDate: album.release_date || '',
				tracks,
				totalDuration: getTotalDuration(tracks),
				releaseYear: album.release_date?.split('-')[0] || '',
				genre: formatGenre(album.genres),
				spotifyCode: await getTintedSpotifyCode(
					album.id,
					selectedTheme?.backgroundColor || DEFAULT_THEMES[0].background,
					selectedTheme?.foregroundColor || DEFAULT_THEMES[0].foreground
				),
				albumId: album.id,
				colors: selectedTheme?.colors || Array(5).fill('#000000'),
				backgroundColor: selectedTheme?.backgroundColor || DEFAULT_THEMES[0].background,
				foregroundColor: selectedTheme?.foregroundColor || DEFAULT_THEMES[0].foreground
			};

			set({ posterData, size: { x: 2480, y: 3508 } });

			if (!selectedTheme?.colors) {
				try {
					const colors = await extractColors(posterData.cover);
					const paddedColors = [...colors, ...Array(5).fill('#000000')].slice(0, 5);
					update((store) => ({
						...store,
						posterData: { ...store.posterData, colors: paddedColors }
					}));
				} catch (error) {
					console.error('Error extracting colors:', error);
				}
			}

			selectedTheme = null;
		},
		/**
		 * @param {Partial<import('$lib/types/poster').PosterData>} updates
		 */
		updatePosterData: async (updates) => {
			update((store) => {
				const newStore = {
					...store,
					posterData: { ...store.posterData, ...updates }
				};

				if (updates.backgroundColor || updates.foregroundColor) {
					getTintedSpotifyCode(
						store.posterData.albumId,
						newStore.posterData.backgroundColor,
						newStore.posterData.foregroundColor
					).then((spotifyCode) => {
						update((s) => ({
							...s,
							posterData: { ...s.posterData, spotifyCode }
						}));
					});
				}

				return newStore;
			});
		},
		getThemes: () => DEFAULT_THEMES
	};
}

export const posterStore = createPosterStore();

export { getTotalDuration, formatGenre, extractColors, getTintedSpotifyCode };
