import fs from "fs";
import { resolve } from "path";
import { Parser } from "htmlparser2";
import { PassThrough } from "stream";

const Tokeniser = (stream: NodeJS.ReadableStream) => {
	const pass = new PassThrough({ objectMode: true });
	const parser = new Parser(
		{
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
		},
		{ decodeEntities: true },
	);

	return (async function*() {
		stream.on("data", chunk => parser.write(chunk));
		for await (const token of pass) {
			yield token;
		}
	})();
};

const getSelector = (attr: { id?: string; class?: string }) => {
	let selector = "";
	const convert = (str: string, add: string) =>
		`${add}${str
			.split(" ")
			.join(add)
			.replace(/"/g, `"`)}`;
	if (attr.id) selector += convert(attr.id, "#");
	if (attr.class) selector += convert(attr.class, ".");
	return selector;
};

async function* Html2Hyperscript(stream: NodeJS.ReadableStream) {
	const elements: Set<string> = new Set();
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
				} else {
					state.started = true;
				}

				if (state.prev === "attr") {
					yield state.pending;
				}

				yield "\t".repeat(state.indentLevel++) + name;

				const attrKeys = Object.keys(attr);
				if (attrKeys.length) {
					const selector = getSelector(attr);
					if (selector) yield `["${selector}"]`;
					yield "(";

					delete attr.class;
					delete attr.id;

					const attrKeys = Object.keys(attr);
					if (attrKeys.length) {
						yield JSON.stringify(attr);
						state.prev = "attr";
						state.pending = ", ";
					}
				} else {
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

				let text: string = token;

				if (text.includes("`")) {
					const escapedTick = String.raw`\``;
					const makeRaw = (t: string) => "String.raw`" + escapedTick + t + "`";
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
				if (state.started) yield ";\n";
			}
		}
	}
	return [...elements];
}

(async () => {
	for await (const segment of Html2Hyperscript(
		fs.createReadStream(resolve(__dirname, "../..", "html.html")),
	)) {
		if (!Array.isArray(segment)) process.stdout.write(segment);
	}
})();
