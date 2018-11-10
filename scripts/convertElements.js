#!/usr/bin/env node

/* Tiny util to take a newline separated list of elements
	and convert it to a JSON list and a types file for TypeScript */
const { readFile, writeFile } = require('fs-extra');
const path = require('path');

(async function main () {

	const txt = await readFile(
		path.join(__dirname, '/../assets/htmlElements.txt'),
		{ encoding: 'utf8' }
	);

	const elements = txt.split('\n').map(el => `"${el}"`);

	const list = elements
		.map((el, index, arr) =>
			'\t' + el + (index === arr.length - 1 ? '' : ',')
		);

	const json = [ '[', ...list, ']' ].join('\n');

	const types = 'type Elements = '
		+ elements.join(' | ')
		+ ';\nexport default Elements;\n';

	await writeFile(
		path.join(__dirname, '/../assets/htmlElements.json'),
		json,
		{ encoding: 'utf8' }
	);
	
	console.log('Done converting txt -> JSON');

	await writeFile(
		path.join(__dirname, '/../assets/htmlElements.ts'),
		types,
		{ encoding: 'utf8' }
	);
	
	console.log('Done converting txt -> types');

})();
