import m, { Vnode, Children, Attributes } from "mithril";
import elementNames from "./htmlElements";
import { join, Memo } from "./utils";

const SELECTOR = Symbol("@@mithril-toolset/selector");

const o = (...args: any) => (f: Function, g: Function) => g(f(...args));

const id = <T>(x: T) => x;

const pipe = (...fs: Function[]) => (...args: any) => fs.reduce(o(...args), id);

/* Creates a virtual element (Vnode). */
interface MithrilScript {
	(...children: Children[]): Vnode<any, any>;
	(attributes: Attributes, ...children: Children[]): Vnode<any, any>;
	[SELECTOR]: string;
	[key: string]: MithrilScript;
}

type Elements = { [name in elementNames]: MithrilScript };

const memo = Memo<MithrilScript>();

function mithril(selector: string) {
	const mithrilScript = <MithrilScript>(
		((...args: any[]) => m(mithrilScript[SELECTOR], ...args))
	);
	mithrilScript[SELECTOR] = selector;
	return mithrilScript;
}

const classProxy = (m: MithrilScript): MithrilScript =>
	new Proxy(m, {
		get: (m, prop: string) => {
			if (prop in m) return m[prop];
			// check if prop starts with . or #
			const isSelector = /^\.|#/.test(prop);
			// add . to prop to make it a valid class
			m[SELECTOR] = join(m[SELECTOR], !isSelector && ".", prop);
			return classProxy(m);
		},
	});

export default new Proxy(
	{},
	{ get: (_, name: string) => memo.call(pipe(mithril, classProxy), name) },
) as Elements;
