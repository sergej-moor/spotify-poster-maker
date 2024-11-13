/**
 * @typedef {Object} SanitizeResponse
 * @property {string} sanitized
 * @property {boolean} changed
 */

const patterns = [
	// Edition patterns
	/(?:\s*[-/]\s*|\s*\(|\s*\[)\s*(?:Deluxe|Special|Anniversary|Expanded|Complete|Bonus|Digital|Remastered|Limited)(?:\s*Edition)?\s*(?:\)|\])?\s*/gi,

	// Year patterns
	/(?:\s*[-–]\s*|\s*\(|\s*\[)\s*\d{4}\s*(?:Edition|Version|Release|Remaster)?\s*(?:\)|\])?\s*/gi,

	// Common suffixes in various formats
	/(?:\s*[-/]\s*|\s*\(|\s*\[)\s*(?:Remaster(?:ed)?|Mix|Mono|Stereo|Single|Version)\s*(?:\)|\])?\s*/gi,

	// Live recordings
	/(?:\s*[-/]\s*|\s*\(|\s*\[)\s*Live(?:\s+(?:at|in|from)\s+[\w\s,]+)?\s*(?:\)|\])?\s*/gi,

	// Featured artists
	/(?:\s*[-/]\s*|\s*\(|\s*\[)\s*(?:feat\.?|featuring|with)\s+[^)\]]+\s*(?:\)|\])?\s*/gi,

	// Clean up any remaining year references
	/\s*[-–]?\s*\d{4}\s*/g
];

// Additional cleanup patterns
const cleanupPatterns = [
	// Remove empty parentheses and brackets
	/\(\s*\)/g,
	/\[\s*\]/g,

	// Remove orphaned brackets and parentheses
	/\s*\([^)]*$/g, // Unclosed parentheses
	/\s*\[[^\]]*$/g, // Unclosed brackets
	/^[^(]*\)\s*/g, // Closing without opening
	/^[^[]*\]\s*/g, // Closing without opening

	// Remove trailing separators
	/[-/;:]\s*$/g,

	// Clean up multiple spaces
	/\s+/g
];

/**
 * Server-side sanitization of a title
 * @param {string} title - The title to sanitize
 * @returns {SanitizeResponse} The sanitized title and whether it changed
 */
export function sanitizeTitle(title) {
	if (!title) return { sanitized: '', changed: false };

	let sanitized = title;

	// Apply main patterns
	patterns.forEach((pattern) => {
		sanitized = sanitized.replace(pattern, ' ').trim();
	});

	// Apply cleanup patterns
	cleanupPatterns.forEach((pattern) => {
		sanitized = sanitized.replace(pattern, ' ').trim();
	});

	// Final cleanup: normalize spaces and trim
	sanitized = sanitized.replace(/\s+/g, ' ').trim();

	// Check if sanitizing erased everything or left only whitespace
	if (!sanitized || sanitized.length === 0) {
		return {
			sanitized: title,
			changed: false
		};
	}

	return {
		sanitized,
		changed: sanitized !== title
	};
}

/**
 * Client-side width measurement for display truncation
 * @param {string} title - The title to measure
 * @param {number} maxWidth - Maximum width allowed
 * @param {string} [font='Oswald'] - Font family to use
 * @param {string} [fontSize='9rem'] - Font size to use
 * @returns {SanitizeResponse} The truncated title and whether it changed
 */
export function measureTitleWidth(title, maxWidth, font = 'Oswald', fontSize = '9rem') {
	if (typeof window === 'undefined') {
		return { sanitized: title, changed: false };
	}

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	if (!context) return { sanitized: title, changed: false };

	context.font = `${fontSize} ${font}`;
	const width = context.measureText(title).width;

	if (width <= maxWidth) {
		return { sanitized: title, changed: false };
	}

	// Binary search for best fit
	let start = 0;
	let end = title.length;
	let bestFit = '';

	while (start <= end) {
		const mid = Math.floor((start + end) / 2);
		const truncated = title.slice(0, mid);
		const truncatedWithEllipsis = truncated + '...';

		const currentWidth = context.measureText(truncatedWithEllipsis).width;

		if (currentWidth <= maxWidth) {
			bestFit = truncated;
			start = mid + 1;
		} else {
			end = mid - 1;
		}
	}

	return {
		sanitized: bestFit + '...',
		changed: true
	};
}

/**
 * Calculate the maximum width available for the title
 * @param {number} containerWidth - The width of the container
 * @returns {number} The maximum width available for the title
 */
export function calculateMaxTitleWidth(containerWidth) {
	const spotifyCodeWidth = 112; // 28px * 4 (h-28 class)
	const padding = 96; // 24px * 4 (p-24 class)
	return containerWidth - (spotifyCodeWidth + padding);
}
