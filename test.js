require('mithril/test-utils/browserMock')(global);
const assert = require('assert');
const render = require('mithril-node-render');
const { elements: { html, head, body, div, h1, h2, p } } = require('./dist');

const testHTML =
	'<html><head></head><body class="container"><div class="hello world"><h1>Hello World</h1><h2>Subheading</h2><p>This is some text</p></div></body></html>';

render(
	html(
		head(),
		body['.container'](
			div.hello.world(
				h1('Hello World'),
				h2('Subheading'),
				p('This is some text')
			)
		)
	)
).then(html => {
	assert.equal(html, testHTML);
}).then(() => {
	console.log('> [info] Test passed!');
}).catch(console.error);
