#!/bin/env node

import { writeFileSync } from "fs";
import { resolve } from "path";
import { rm, mkdir } from "shelljs";

import chokidar from "chokidar";

declare global {
	namespace NodeJS {
		interface Global {
			window: undefined;
			document: undefined;
			requestAnimationFrame: undefined;
		}
	}
}

// Make Mithril happy
if (!global.window) {
	global.window = global.document = global.requestAnimationFrame = undefined;
}

import render from "mithril-node-render";
import { Vnode } from "mithril";

const invalidate = (
	pred: (key: string) => boolean,
	cache: Record<string, any>,
) => {
	for (const key in cache) {
		if (pred(key)) delete cache[key];
	}
};

type Templates = {
	pages: [string, Vnode][];
	stylesheets: [string, string][];
};

const getTemplates = () => {
	const markup = resolve(__dirname, "..", "src/markup");
	invalidate(test => !test.startsWith(__dirname), require.cache);
	return require(markup) as Templates;
};

const debounce = <F extends Function>(t: number) => (f: F) => {
	let timeout: NodeJS.Timeout;
	return (...args: any) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => f(...args), t);
	};
};

const tryCatch = <T extends Function>(f: T) => {
	try {
		f();
	} catch (e) {
		console.error(e);
	}
};

const outDir = resolve(__dirname, "..", "docs");

const bob = ({ watch = true }) => {
	const build = () => (
		console.log("Building src/markup..."),
		tryCatch(() => {
			const { pages, stylesheets } = getTemplates();

			// clean outDir
			rm("-rf", resolve(outDir, "css"));
			rm(outDir + "/*.html");

			// create outDir for CSS
			mkdir("-p", resolve(outDir, "css"));

			pages.forEach(async ([path, html]) =>
				writeFileSync(resolve(outDir, path), await render(html)),
			);

			stylesheets.forEach(([path, css]) =>
				writeFileSync(resolve(outDir, path), css),
			);
		})
	);

	if (watch) {
		console.log("Watching src/markup...");
		chokidar
			.watch(resolve(__dirname, "..", "src/markup"))
			.on("all", debounce(100)(build));
	} else build();
};

module.exports = { builder: bob };

if (require.main === module) {
	const watch = process.argv.includes("--watch") || process.argv.includes("-w");

	module.exports({ watch });
}
