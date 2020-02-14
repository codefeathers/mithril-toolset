"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
