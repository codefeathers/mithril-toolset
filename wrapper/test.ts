// @ts-ignore
import browserMock = require('mithril/test-utils/browserMock'); browserMock(global);

import render from 'mithril-node-render';
import m from './wrapper';

import assert from 'assert';

const {html, head, body, h1, h2, div, p} = m;
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
}).catch(console.error);
