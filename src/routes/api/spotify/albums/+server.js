import { json } from '@sveltejs/kit';
import { spotifyRequest } from '$lib/server/spotify';

export async function GET({ url }) {
	const id = url.searchParams.get('id');

	if (!id) {
		return json({ error: 'Album ID is required' }, { status: 400 });
	}

	const data = await spotifyRequest({
		endpoint: `/albums/${id}`
	});

	return json(data);
}
