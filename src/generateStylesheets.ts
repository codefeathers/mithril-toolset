import { createHash } from "crypto";
import { EmotionCache } from "emotion";

import { join } from "./utils";

const convertToFilename = (name: string) => `css/${name}.css`;

const getFiles = (name: string, CSS: string) => [
	join(
		name,
		".",
		convertToFilename(
			createHash("md5")
				.update(CSS)
				.digest("hex")
				.substr(0, 12),
		),
	),
	CSS,
];

const composeCSS = (cache: EmotionCache["inserted"]) => {
	let CSS = "";
	for (const key in cache) {
		CSS += "\n" + cache[key];
	}
	return CSS;
};

export default (stylesheets: [string, EmotionCache][]) =>
	stylesheets.map(([name, cache]) =>
		getFiles(name, composeCSS(cache.inserted)),
	);
