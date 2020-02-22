import m, { Vnode, Children, Attributes } from "mithril";
import elementNames from "./htmlElements";
import { join, Memo, Falsy } from "../utils";

const Selector = Symbol("@@mithril-toolset/selector");
const False = Symbol("@@mithril-toolset/false");
type False = typeof False;

const o = (f: Function, g: Function) => (...args: any) => g(f(...args));

const id = <T>(x: T) => x;

const pipe = (...fs: Function[]) => (...args: any) => fs.reduce(o, id)(...args);

/* Creates a virtual element (Vnode). */
interface MithrilScript {
	(...children: Children[]): Vnode<any, any>;
	(attributes: Attributes, ...children: Children[]): Vnode<any, any>;
	[Selector]: string;
	[False]: MithrilScript;
	[key: string]: MithrilScript;
}

type Elements = { [name in elementNames]: MithrilScript };

const memo = Memo<MithrilScript>();

function mithril(selector: string) {
	const mithrilScript = <MithrilScript>(
		((...args: any[]) => m(mithrilScript[Selector], ...args))
	);
	mithrilScript[Selector] = selector;
	return mithrilScript;
}

const classProxy = (m: MithrilScript): MithrilScript =>
	new Proxy(m, {
		get: (m, prop: string | False) => {
			if (prop in m) return m[prop];

			if (prop === False) return m;

			// check if prop starts with . or #
			const isSelector = /^\.|#/.test(prop);
			// add . to prop to make it a valid class
			m[Selector] = join(m[Selector], !isSelector && ".", prop);

			return classProxy(m);
		},
	});

export const maybe = (x: string | Falsy) => x || False;

export const elements = new Proxy(
	{},
	{ get: (_, name: string) => memo.call(pipe(mithril, classProxy), name) },
) as Elements;
