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
	'3uFZf8rykoHo7XMIQVYW6r',
	'50o7kf2wLwVmOTVYJOTplm',

	'3mH6qwIy9crq0I9YQbOuDf',
	'5zi7WsKlIiUXv09tbGLKsE',
	'6DEjYFkNZh67HP7R9PSZvv',
	'31qVWUdRrlb8thMvts0yYL',
	'287QQ922OsJYh8aFNGdJG5',
	'6dVIqQ8qmQ5GBnJ9shOYGE',
	'7aPolrSqVawIhC7iTo2b5F',
	'2AxfZb5aQHIXgsB1HA6OLL',
	'5TkaDC4mYSLBvdG6UrIB0v',
	'4LH4d3cOWNNsVw41Gqt2kv',
	'51HFfu3GhuXa4VUnlpJJy8',
	'4m2880jivSbbyEGAKfITCa',
	'2ANVost0y2y52ema1E9xAZ',
	'0ETFjACtuP2ADo6LFhL6HN'
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
