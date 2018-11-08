#!/usr/bin/env node

/* Tiny util to take a newline separated
	list of elements and convert it to a JSON list */
const { readFile, writeFile } = require('fs').promises;
const path = require('path');

(async function main () {

	const txt = await readFile(
		path.join(__dirname, '/../assets/htmlElements.txt'),
		{ encoding: 'utf8' }
	);

	const elements = txt.split('\n')
		.map((element, index, arr) =>
			'\t' + `"${element}"` + (index === arr.length - 1 ? '' : ',')
		);

	const json = [ '[', ...elements, ']' ].join('\n');

	await writeFile(
		path.join(__dirname, '/../assets/htmlElements.json'),
		json,
		{ encoding: 'utf8' }
	);
	
	console.log('Done converting txt -> JSON');

})();
