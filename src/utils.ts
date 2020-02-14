export type Falsy = false | "" | 0 | 0n | undefined | null;

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
