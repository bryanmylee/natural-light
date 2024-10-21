import * as hsl from '$lib/color/hsl';

export const setDocumentColor = (color: hsl.Hsl) => {
	if (typeof document === 'undefined') return;
	document.body.style.backgroundColor = hsl.toCssProperty(color);
};
