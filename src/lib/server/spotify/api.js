import { error } from '@sveltejs/kit';
import { getAccessToken } from './auth';

export async function spotifyRequest({ endpoint, params, method = 'GET' }) {
	try {
		const accessToken = await getAccessToken();
		const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
		const url = `https://api.spotify.com/v1${endpoint}${queryString}`;

		const res = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			throw error(res.status, `Failed to fetch from Spotify API: ${res.statusText}`);
		}

		return await res.json();
	} catch (err) {
		console.error('Spotify API error:', err);
		throw error(500, 'Failed to fetch from Spotify API');
	}
}
