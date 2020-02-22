"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const o = (f, g) => (...args) => g(f(...args));
exports.id = (x) => x;
exports.pipe = (...fs) => (...args) => fs.reduce(o, exports.id)(...args);
exports.join = (...segs) => {
    let ret = "";
    for (const seg of segs) {
        if (seg)
            ret += seg;
    }
    return ret;
};
exports.Memo = () => {
    const cache = {};
    return {
        call: (f, arg) => {
            if (cache[arg])
                return cache[arg];
            const val = f(arg);
            cache[arg] = val;
            return val;
        },
    };
};
exports.convertToFilename = (name, ext) => `css/${name}.${ext}`;
exports.getFiles = (ext) => (name, CSS) => [
    exports.join(name, ".", exports.convertToFilename(crypto_1.createHash("md5")
        .update(CSS)
        .digest("hex")
        .substr(0, 12), ext)),
    CSS,
];
