const axios = require('axios');
const { JSDOM } = require('jsdom');

module.exports = async function scraper () {

	return axios.get('https://developer.mozilla.org/en-US/docs/Web/HTML')
		.then(({ data: html }) => {

			const { window: { document } } = new JSDOM(html);

			return Array.from(
					document.querySelector(
						'li.toggle:nth-child(7) > details:nth-child(1) > ol:nth-child(2)')
					.getElementsByTagName('li'))
					/* Filter out elements that have a warning near them (deprecated or experimental) */
					.filter(element => !(element.querySelector('span.sidebar-icon')))
					.map(element => element
						.getElementsByTagName('code')[0] // Extract the tag name
						.innerHTML
						.replace(/(&lt;)|(&gt;)/g, '')) // Remove < and > from the tags
					.concat([ 'h2', 'h3', 'h4', 'h5', 'h6' ]) // MDN has these truncated into h1
					.sort();

		})

};