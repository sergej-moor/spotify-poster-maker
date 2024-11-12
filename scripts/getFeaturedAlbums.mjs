import { writeFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const featuredAlbumIds = [
	'4LH4d3cOWNNsVw41Gqt2kv',
	'2fenSS68JI1h4Fo296JfGr',
	'6dVIqQ8qmQ5GBnJ9shOYGE',
	'2widuo17g5CEC66IbzveRu',
	'4m2880jivSbbyEGAKfITCa',
	'3ycjBixZf7S3WpC5WZhhUn',
	'2ANVost0y2y52ema1E9xAZ',
	'4LxFDUxKxjZhLxhaSICflq',
	'2ODvWsOgouMbaA5xf0RkJe',
	'2v6ANhWhZBUKkg6pJJBs3B'
];

async function getFeaturedAlbums() {
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		throw new Error('Missing Spotify credentials in .env file');
	}

	// Get access token
	const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
		},
		body: 'grant_type=client_credentials'
	});

	const { access_token } = await tokenRes.json();

	const albums = await Promise.all(
		featuredAlbumIds.map(async (id) => {
			const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			});
			if (res.ok) {
				return res.json();
			}
			return null;
		})
	);

	const validAlbums = albums.filter((album) => album !== null);

	// Create the output file
	const output = `/** @type {import('$lib/types/spotify').SpotifyAlbum[]} */
export const featuredAlbums = ${JSON.stringify(validAlbums, null, 2)};
`;

	writeFileSync(join(process.cwd(), 'src/lib/data/featuredAlbums.js'), output);
}

getFeaturedAlbums().catch(console.error);
