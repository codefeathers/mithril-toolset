"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mithril_1 = __importDefault(require("mithril"));
const utils_1 = require("../utils");
const Selector = Symbol("@@mithril-toolset/selector");
const False = Symbol("@@mithril-toolset/false");
const memo = utils_1.Memo();
const componentSelectors = new WeakMap();
const getSelector = (component) => componentSelectors.get(component);
function MithrilScript(selector) {
    const mithril = (((...args) => mithril_1.default(getSelector(mithril), ...args)));
    componentSelectors.set(mithril, selector);
    return mithril;
}
const createSelector = (component, prop) => {
    // So you can create multiple instances of something
    if (prop === "" || prop === False)
        return getSelector(component);
    // check if prop starts with . or #
    const isSelector = /^\.|#/.test(prop);
    // add . to prop to make it a valid class
    return utils_1.join(getSelector(component), !isSelector && ".", prop);
};
const wrapGetter = (getter) => (obj, prop, receiver) => {
    if (prop in obj || prop === "then")
        return obj[prop];
    return getter(obj, prop, receiver);
};
const classProxy = (mithril) => new Proxy(mithril, {
    get: wrapGetter((component, prop) => classProxy(MithrilScript(createSelector(component, prop)))),
});
exports.maybe = (x) => x || False;
exports.elements = new Proxy({}, {
    get: wrapGetter((_, name) => memo.call(utils_1.pipe(MithrilScript, classProxy), name)),
});
