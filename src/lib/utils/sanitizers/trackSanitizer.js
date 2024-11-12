/**
 * @typedef {Object} SanitizeResponse
 * @property {string} sanitized
 * @property {boolean} changed
 */

/**
 * @param {string[]} tracks
 * @returns {string[]}
 */
function removeCommonSuffixes(tracks) {
	let validTracks = tracks.filter(Boolean); // Remove empty tracks
	if (validTracks.length <= 1) return validTracks;

	let modified = [...validTracks];
	let continueChecking = true;

	while (continueChecking) {
		// Get the last character of each track
		const lastChars = modified.map((track) => track[track.length - 1]);

		// Check if all last characters are the same
		const allSame = lastChars.every((char) => char === lastChars[0]);

		if (allSame && modified[0].length > 1) {
			// Remove the last character from all tracks
			modified = modified.map((track) => track.slice(0, -1).trim());
		} else {
			continueChecking = false;
		}
	}

	return modified;
}

/**
 * @param {Array<{name: string}>} tracks
 * @returns {SanitizeResponse[]}
 */
export function sanitizeTrackNames(tracks) {
	// First remove common suffixes
	const commonSuffixRemoved = removeCommonSuffixes(tracks.map((t) => t.name));

	// Then apply the regex patterns
	const patterns = [
		/(\s*-\s*(Remastered|Mix|Mono|Stereo|Single Version|Live Version|V?\d*\s*Edit|Version)\s*\d{0,4}\s*[;:]?)/gi, // Removes common suffixes like "- Remastered", "- V1 Edit", etc.
		/(\s*[-/]\s*Live\s*(At|In|From)\s*[\w\s,]*\d{0,4})/gi, // Matches " - Live At [Venue, City, Year]", " / Live In [Venue, City]", and " - Live From [Source]"
		/(\s*\(\s*(Remastered|Single Version|Live Version|V?\d*\s*Edit|feat\.?\s*[\w\s,&]*)\s*\d{0,4}\s*\))/gi, // Matches "(Remastered)", "(Live Version)", "(feat. Artist)"
		/(\s*(feat\.?|featuring)\s+[\w\s,&]+$)/gi, // Matches "feat. Artist", "featuring Artist" at the end of the string
		/(\s*\d{4}\s*(Remaster|Mix)?)/gi, // Matches patterns like "2015 Remaster", "2009 Mix"
		/(\s*[-/;:]\s*$)/gi // Removes trailing dashes, slashes, colons, and semicolons
	];

	const finalSanitized = commonSuffixRemoved.map((track) => {
		if (!track) return '';

		let sanitized = track;
		patterns.forEach((pattern) => {
			sanitized = sanitized.replace(pattern, '').trim();
		});
		return sanitized;
	});

	// Map back to the response format
	return tracks.map((track, index) => ({
		sanitized: finalSanitized[index] || track.name,
		changed: finalSanitized[index] !== track.name
	}));
}
