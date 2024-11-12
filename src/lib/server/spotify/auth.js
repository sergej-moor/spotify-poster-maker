import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';

let accessToken;
let tokenExpiresAt;

export async function getAccessToken() {
	const currentTime = Date.now();

	if (accessToken && tokenExpiresAt && currentTime < tokenExpiresAt) {
		return accessToken;
	}

	const response = await axios.post(
		'https://accounts.spotify.com/api/token',
		new URLSearchParams({ grant_type: 'client_credentials' }),
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization:
					'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
			}
		}
	);

	accessToken = response.data.access_token;
	tokenExpiresAt = currentTime + response.data.expires_in * 1000 - 60000; // Refresh 1 minute before expiry
	return accessToken;
}
