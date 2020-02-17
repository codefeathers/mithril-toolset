"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const composeCSS = (cache) => {
    let CSS = "";
    for (const key in cache) {
        CSS += "\n" + cache[key];
    }
    return CSS;
};
exports.default = (stylesheets) => stylesheets.map(([name, cache]) => utils_1.getFiles("css")(name, composeCSS(cache.inserted)));
