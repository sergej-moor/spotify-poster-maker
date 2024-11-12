import { getAccessToken } from '$lib/server/spotify';
import { sanitizeTrackNames } from '$lib/utils';
import { sanitizeTitle } from '$lib/utils';

/**
 * Enriches album data with sanitized titles and additional artist information
 * @param {import('$lib/types/spotify').SpotifyAlbum} album - The album object from Spotify API
 * @returns {Promise<import('$lib/types/spotify').SpotifyAlbum>} - The enriched album object
 */
export async function enrichAlbumData(album) {
	try {
		const accessToken = await getAccessToken();

		// Sanitize album title
		const { sanitized: sanitizedTitle } = sanitizeTitle(album.name);
		album.name = sanitizedTitle;

		// Sanitize track names if they exist
		if (album.tracks?.items) {
			const tracksToSanitize = album.tracks.items.map((track) => ({ name: track.name }));
			const sanitizedResults = sanitizeTrackNames(tracksToSanitize);

			album.tracks.items = album.tracks.items.map((track, index) => ({
				...track,
				name: sanitizedResults[index].sanitized
			}));
		}

		// Fetch artist data for genres
		const artistRes = await fetch(`https://api.spotify.com/v1/artists/${album.artists[0].id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (!artistRes.ok) {
			throw new Error('Failed to fetch artist data');
		}

		const artistData = await artistRes.json();
		album.genres = artistData.genres;

		return album;
	} catch (error) {
		console.error('Error enriching album data:', error);
		return album; // Return original album if enrichment fails
	}
}
