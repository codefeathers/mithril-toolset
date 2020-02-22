"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const htmlparser2_1 = require("htmlparser2");
const stream_1 = require("stream");
const Tokeniser = (stream) => {
    const pass = new stream_1.PassThrough({ objectMode: true });
    const parser = new htmlparser2_1.Parser({
        onopentag(name, attr) {
            pass.write(["opentag", { name, attr }]);
        },
        oncomment(comments) {
            (comments = comments.trim()) &&
                comments
                    .split("\n")
                    .forEach(comment => pass.write(["comment", comment]));
        },
        ontext(text) {
            (text = text.trim()) && pass.write(["text", text]);
        },
        onclosetag() {
            pass.write(["closetag"]);
        },
        onend() {
            pass.write(["end"]);
        },
    }, { decodeEntities: true });
    return (async function* () {
        stream.on("data", chunk => parser.write(chunk));
        for await (const token of pass) {
            yield token;
        }
    })();
};
const getSelector = (attr) => {
    let selector = "";
    const convert = (str, add) => `${add}${str
        .split(" ")
        .join(add)
        .replace(/"/g, `"`)}`;
    if (attr.id)
        selector += convert(attr.id, "#");
    if (attr.class)
        selector += convert(attr.class, ".");
    return selector;
};
async function* Html2Hyperscript(stream) {
    const elements = new Set();
    const state = {
        started: false,
        indentLevel: 0,
        prev: "",
        next: "",
        pending: "",
    };
    for await (const [type, token] of Tokeniser(stream)) {
        // console.log(token);
        switch (type) {
            case "opentag": {
                const { name, attr } = token;
                elements.add(name);
                if (state.started) {
                    yield "\n";
                }
                else {
                    state.started = true;
                }
                if (state.prev === "attr") {
                    yield state.pending;
                }
                yield "\t".repeat(state.indentLevel++) + name;
                const attrKeys = Object.keys(attr);
                if (attrKeys.length) {
                    const selector = getSelector(attr);
                    if (selector)
                        yield `["${selector}"]`;
                    yield "(";
                    delete attr.class;
                    delete attr.id;
                    const attrKeys = Object.keys(attr);
                    if (attrKeys.length) {
                        yield JSON.stringify(attr);
                        state.prev = "attr";
                        state.pending = ", ";
                    }
                }
                else {
                    yield "(";
                }
                state.prev = "opentag";
                break;
            }
            case "comment": {
                yield "\n// " + "\t".repeat(state.indentLevel) + token.trim();
                break;
            }
            case "text": {
                if (state.prev === "text") {
                    yield ", ";
                }
                let text = token;
                if (text.includes("`")) {
                    const escapedTick = String.raw `\``;
                    const makeRaw = (t) => "String.raw`" + escapedTick + t + "`";
                    text = makeRaw(text.replace(/`/g, escapedTick));
                }
                if (text.includes("&")) {
                    text = `m.trust(${text})`;
                }
                yield text;
                state.prev = "text";
                break;
            }
            case "closetag": {
                if (state.prev === "closetag") {
                    yield state.pending;
                }
                yield ")";
                state.pending = ",";
                state.prev = "closetag";
                break;
            }
            case "end": {
                if (state.started)
                    yield ";\n";
            }
        }
    }
    return [...elements];
}
(async () => {
    for await (const segment of Html2Hyperscript(fs_1.default.createReadStream(path_1.resolve(__dirname, "../..", "html.html")))) {
        if (!Array.isArray(segment))
            process.stdout.write(segment);
    }
})();
