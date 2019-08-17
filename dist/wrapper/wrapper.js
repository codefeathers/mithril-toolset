"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mithril_1 = __importDefault(require("mithril"));
function createMithrilScript(selector) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return mithril_1.default.apply(void 0, [selector].concat(args));
    };
}
var createClassProxy = function (m, name) { return new Proxy(m, {
    get: function (f, selector) {
        var isPureClass = selector.split('.').length === 1
            && selector.split('#').length === 1;
        var newSelector = name + ("" + (isPureClass ? '.' : '') + selector);
        return createClassProxy(createMithrilScript(newSelector), newSelector);
    }
}); };
exports.default = new Proxy({}, {
    get: function (obj, name) {
        return createClassProxy(createMithrilScript(name), name);
    }
});
