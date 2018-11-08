const m = require('mithril');

const htmlElements = require('../assets/htmlElements.json');
module.exports = htmlElements.reduce(
	(elements, el) => (
		{ ...elements, [el]: (...children) => m(el, ...children)}
	), {}
);
