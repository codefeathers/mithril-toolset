"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const utils_1 = require("./utils");
const convertToFilename = (name) => `css/${name}.css`;
const getFiles = (name, CSS) => [
    utils_1.join(name, ".", convertToFilename(crypto_1.createHash("md5")
        .update(CSS)
        .digest("hex")
        .substr(0, 12))),
    CSS,
];
const composeCSS = (cache) => {
    let CSS = "";
    for (const key in cache) {
        CSS += "\n" + cache[key];
    }
    return CSS;
};
exports.default = (stylesheets) => stylesheets.map(([name, cache]) => getFiles(name, composeCSS(cache.inserted)));
