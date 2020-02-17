"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mithril_1 = __importDefault(require("mithril"));
const utils_1 = require("../utils");
const SELECTOR = Symbol("@@mithril-toolset/selector");
const o = (...args) => (f, g) => g(f(...args));
const id = (x) => x;
const pipe = (...fs) => (...args) => fs.reduce(o(...args), id);
const memo = utils_1.Memo();
function mithril(selector) {
    const mithrilScript = (((...args) => mithril_1.default(mithrilScript[SELECTOR], ...args)));
    mithrilScript[SELECTOR] = selector;
    return mithrilScript;
}
const classProxy = (m) => new Proxy(m, {
    get: (m, prop) => {
        if (prop in m)
            return m[prop];
        // check if prop starts with . or #
        const isSelector = /^\.|#/.test(prop);
        // add . to prop to make it a valid class
        m[SELECTOR] = utils_1.join(m[SELECTOR], !isSelector && ".", prop);
        return classProxy(m);
    },
});
exports.default = new Proxy({}, { get: (_, name) => memo.call(pipe(mithril, classProxy), name) });
