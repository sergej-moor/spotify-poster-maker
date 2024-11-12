/** @module types/poster */

/**
 * @typedef {Object} Track
 * @property {string} name
 * @property {number} duration_ms
 * @property {boolean} visible
 */

/**
 * @typedef {Object} PosterData
 * @property {string} cover
 * @property {string} title
 * @property {string} artist
 * @property {string} releaseDate
 * @property {Track[]} tracks
 * @property {string} totalDuration
 * @property {string} releaseYear
 * @property {string} genre
 * @property {string} spotifyCode
 * @property {string} albumId
 * @property {string[]} [colors]
 * @property {string} backgroundColor
 * @property {string} foregroundColor
 */

/**
 * @typedef {Object} Dimensions
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} PosterStore
 * @property {PosterData} posterData
 * @property {Dimensions} size
 */

/**
 * @typedef {Object} ColorTheme
 * @property {string} name
 * @property {string} background
 * @property {string} foreground
 */

// Need to export something to make it a module
export {};
