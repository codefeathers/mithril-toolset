import m, { Vnode, Children, Attributes } from "mithril";
import elementNames from "./htmlElements";
import { pipe, join, Memo, Falsy } from "../utils";

const Selector = Symbol("@@mithril-toolset/selector");
const False = Symbol("@@mithril-toolset/false");
type False = typeof False;

/* Creates a virtual element (Vnode). */
interface MithrilScript {
	(...children: Children[]): Vnode<any, any>;
	(attributes: Attributes, ...children: Children[]): Vnode<any, any>;
	[Selector]: string;
	[False]: MithrilScript;
	[key: string]: MithrilScript;
}

type Elements = {
	[name in elementNames]: MithrilScript;
};

const memo = Memo<MithrilScript>();

const componentSelectors = new WeakMap<MithrilScript, string>();

const getSelector = (component: MithrilScript) =>
	<string>componentSelectors.get(component);

function MithrilScript(selector: string) {
	const mithril = <MithrilScript>(
		((...args: any[]) => m(getSelector(mithril), ...args))
	);
	componentSelectors.set(mithril, selector);
	return mithril;
}

const createSelector = (component: MithrilScript, prop: string | False) => {
	// So you can create multiple instances of something
	if (prop === "" || prop === False) return getSelector(component);

	// check if prop starts with . or #
	const isSelector = /^\.|#/.test(prop);
	// add . to prop to make it a valid class
	return join(getSelector(component), !isSelector && ".", prop);
};

type Getter<T extends object> = Exclude<ProxyHandler<T>["get"], undefined>;

const wrapGetter = <T extends object & { [False]?: any; [k: string]: any }>(
	getter: Getter<T>,
): Getter<T> => (obj, prop: string | False, receiver) => {
	if (prop in obj || prop === "then") return obj[prop];
	return getter(obj, prop, receiver);
};

const classProxy = (mithril: MithrilScript): MithrilScript =>
	new Proxy(mithril, {
		get: wrapGetter<MithrilScript>((component, prop: string | False) =>
			classProxy(MithrilScript(createSelector(component, prop))),
		),
	});

export const maybe = (x: string | Falsy) => x || False;

export const elements = new Proxy(<Elements>{}, {
	get: wrapGetter<Elements>((_, name: string) =>
		memo.call(pipe(MithrilScript, classProxy), name),
	),
}) as Elements;
