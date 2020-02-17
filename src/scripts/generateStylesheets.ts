import { EmotionCache } from "emotion";
import { getFiles } from "../utils";

const composeCSS = (cache: EmotionCache["inserted"]) => {
	let CSS = "";
	for (const key in cache) {
		CSS += "\n" + cache[key];
	}
	return CSS;
};

export default (stylesheets: [string, EmotionCache][]) =>
	stylesheets.map(([name, cache]) =>
		getFiles("css")(name, composeCSS(cache.inserted)),
	);
