import { spotifyRequest } from '$lib/server/spotify';
import { enrichAlbumData } from '$lib/server/spotify/albumUtils';

/**
 * @typedef {import('$lib/server/spotify/albumUtils').Album} Album
 */

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { id } = params;

	try {
		/** @type {Album} */
		const album = await spotifyRequest({
			endpoint: `/albums/${id}`,
			params: {}
		});

		const enrichedAlbum = await enrichAlbumData(album);

		return { album: enrichedAlbum };
	} catch (error) {
		console.error('Error loading album data:', error);
		return { error: 'Failed to load album data' };
	}
}
