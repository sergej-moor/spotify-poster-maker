import { json } from '@sveltejs/kit';
import { spotifyRequest } from '$lib/server/spotify';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { id } = params;

	if (!id) {
		return json({ error: 'Album ID is required' }, { status: 400 });
	}

	const data = await spotifyRequest({
		endpoint: `/albums/${id}`,
		params: {}
	});

	return json(data);
}
