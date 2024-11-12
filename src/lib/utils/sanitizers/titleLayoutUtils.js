/**
 * @typedef {Object} TitleLayout
 * @property {number} fontSize
 * @property {boolean} isTwoLines
 * @property {string} formattedText
 * @property {number} lineHeight
 */

/**
 * @param {string} text
 * @param {number} fontSize - in rem
 * @param {string} [font='Oswald'] - font family
 * @returns {number}
 */
export function measureTextWidth(text, fontSize, font = 'Oswald') {
	if (typeof window === 'undefined') return 0;

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	if (!context) return 0;

	context.font = `${fontSize}rem ${font}`;
	return context.measureText(text).width;
}

/**
 * @param {string} title
 * @param {number} maxWidth - maximum width in pixels
 * @returns {TitleLayout}
 */
export function calculateTitleLayout(title) {
	if (!title) {
		return {
			fontSize: 9,
			isTwoLines: false,
			formattedText: '',
			lineHeight: 1 // default line height
		};
	}

	const width = measureTextWidth(title, 9);

	if (width > 1650) {
		// Split into two lines
		const words = title.split(' ');
		const halfLength = Math.ceil(words.length / 2);
		const formattedText = words.reduce((acc, word, i) => {
			if (i === halfLength - 1) {
				return acc + word + '\n';
			}
			return acc + word + ' ';
		}, '');

		return {
			fontSize: 5.5,
			isTwoLines: true,
			formattedText,
			lineHeight: 0.9 // tighter line height for two lines
		};
	}

	return {
		fontSize: 9,
		isTwoLines: false,
		formattedText: title,
		lineHeight: 1
	};
}
