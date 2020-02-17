#!/usr/bin/env node

/* Tiny util to take a newline separated list of elements
	and convert it to a JSON list and a types file for TypeScript */
const { writeFile } = require("fs-extra");
const fetchMDN = require("./fetchMDN");
const path = require("path");

(async function main() {
	let elements = await fetchMDN()
		.catch(e => {
			console.error("> [error] while fetching from MDN:", e.stack);
		})
		.then(async json => {
			if (!json) {
				console.error(
					"> [error] Fetching element list from MDN failed!\n" +
						"> [error] This should be reported to <@MKRhere>\n" +
						"> [error] https://github.com/codefeathers/mithril-toolset",
				);
				console.log("> [info] Falling back to older JSON.");
				return require("../assets/htmlElements");
			} else {
				console.log(
					"> [info] Fetching element list successful!\n" +
						"> [info] Persisting to disk...",
				);
				await writeFile(
					path.join(__dirname, "/../src/runtime/htmlElements.json"),
					JSON.stringify(json, null, "\t"),
					{ encoding: "utf8" },
				);
				console.log("> [info] Wrote JSON to file. You should commit this.");
				return json;
			}
		});

	const types =
		"type Elements =\n" +
		elements.map(el => `\t"${el}"`).join(" |\n") +
		";\n\nexport default Elements;\n";

	await writeFile(
		path.join(__dirname, "/../src/runtime/htmlElements.ts"),
		types,
		{
			encoding: "utf8",
		},
	);

	console.log("> [info] Done converting JSON -> types.");
})();
