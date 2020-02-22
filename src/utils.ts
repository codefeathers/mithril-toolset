import { createHash } from "crypto";

export type Falsy = false | "" | 0 | 0n | undefined | null;

const o = (f: Function, g: Function) => (...args: any) => g(f(...args));

export const id = <T>(x: T) => x;

export const pipe = (...fs: Function[]) => (...args: any) =>
	fs.reduce(o, id)(...args);

export const join = (...segs: (string | Falsy)[]) => {
	let ret = "";
	for (const seg of segs) {
		if (seg) ret += seg;
	}
	return ret;
};

export const Memo = <T>() => {
	const cache: { [k: string]: T } = {};
	return {
		call: (f: Function, arg: string) => {
			if (cache[arg]) return cache[arg];
			const val = f(arg);
			cache[arg] = val;
			return val;
		},
	};
};

export const convertToFilename = (name: string, ext: string) =>
	`css/${name}.${ext}`;

export const getFiles = (ext: string) => (name: string, CSS: string) => [
	join(
		name,
		".",
		convertToFilename(
			createHash("md5")
				.update(CSS)
				.digest("hex")
				.substr(0, 12),
			ext,
		),
	),
	CSS,
];
