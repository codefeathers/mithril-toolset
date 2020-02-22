"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mithril_1 = __importDefault(require("mithril"));
const utils_1 = require("../utils");
const Selector = Symbol("@@mithril-toolset/selector");
const False = Symbol("@@mithril-toolset/false");
const o = (f, g) => (...args) => g(f(...args));
const id = (x) => x;
const pipe = (...fs) => (...args) => fs.reduce(o, id)(...args);
const memo = utils_1.Memo();
function mithril(selector) {
    const mithrilScript = (((...args) => mithril_1.default(mithrilScript[Selector], ...args)));
    mithrilScript[Selector] = selector;
    return mithrilScript;
}
const classProxy = (m) => new Proxy(m, {
    get: (m, prop) => {
        if (prop in m)
            return m[prop];
        if (prop === False)
            return m;
        // check if prop starts with . or #
        const isSelector = /^\.|#/.test(prop);
        // add . to prop to make it a valid class
        m[Selector] = utils_1.join(m[Selector], !isSelector && ".", prop);
        return classProxy(m);
    },
});
exports.maybe = (x) => x || False;
exports.elements = new Proxy({}, { get: (_, name) => memo.call(pipe(mithril, classProxy), name) });
