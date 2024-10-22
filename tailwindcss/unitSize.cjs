import plugin from 'tailwindcss/plugin';

const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const unitSize = plugin(({ addUtilities, e }) => {
	const suffix = (size) => (size === 1 ? 'unit' : `unit-${size}`);
	const height = sizes.map((size) => [
		'.' + e(`h-${suffix(size)}`),
		{ height: `calc(${size} * var(--unit-size))` }
	]);
	addUtilities(Object.fromEntries(height));

	const width = sizes.map((size) => [
		'.' + e(`w-${suffix(size)}`),
		{ width: `calc(${size} * var(--unit-size))` }
	]);
	addUtilities(Object.fromEntries(width));

	const fontSize = sizes.map((size) => [
		'.' + e(`text-${suffix(size)}`),
		{ fontSize: `calc(${size} * var(--unit-size))` }
	]);
	addUtilities(Object.fromEntries(fontSize));

	const padding = sizes.map((size) => [
		'.' + e(`p-${suffix(size)}`),
		{ padding: `calc(${size} * var(--unit-size))` }
	]);
	addUtilities(Object.fromEntries(padding));
});

module.exports = unitSize;
