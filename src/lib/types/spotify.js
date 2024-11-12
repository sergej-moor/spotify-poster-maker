/** @module types/spotify */

/**
 * @typedef {Object} SpotifyImage
 * @property {string} url
 */

/**
 * @typedef {Object} SpotifyArtist
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} SpotifyTrack
 * @property {string} name
 * @property {number} duration_ms
 */

/**
 * @typedef {Object} SpotifyAlbum
 * @property {string} id
 * @property {string} name
 * @property {SpotifyImage[]} images
 * @property {SpotifyArtist[]} artists
 * @property {string} release_date
 * @property {number} total_tracks
 * @property {{items: SpotifyTrack[]}} [tracks]
 * @property {string[]} [genres]
 */

export {};
