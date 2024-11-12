import { json } from '@sveltejs/kit';
import { spotifyRequest } from '$lib/server/spotify';

export async function GET({ url }) {
	const query = url.searchParams.get('query');
	const limit = url.searchParams.get('limit') || '20';

	const data = await spotifyRequest({
		endpoint: '/search',
		params: {
			q: query,
			type: 'album',
			limit
		}
	});

	return json(data);
}
