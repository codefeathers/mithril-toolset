import m, { Vnode, Children, Attributes } from 'mithril';
import elementNames from '../assets/htmlElements';

/* Creates a virtual element (Vnode). */
interface CurriedHyperScript {
	(...children: Children[]): Vnode<any, any>;
	(attributes: Attributes, ...children: Children[]): Vnode<any, any>;
}

interface MithrilScript extends CurriedHyperScript {
	[key: string]: MithrilScript
}

function createMithrilScript (selector: string): MithrilScript
function createMithrilScript (selector: string) {
	return (...args: any[]) => m(selector, ...args);
}

type Elements = { [name in elementNames]: MithrilScript }

const createClassProxy = (h: CurriedHyperScript, name: any): any => new Proxy(h, {
	get: (f, selector: string) => {
		const isPureClass =
			selector.split('.').length === 1
			&& selector.split('#').length === 1;
		const newSelector = name + `${isPureClass ? '.' : ''}${selector}`;
		return createClassProxy(createMithrilScript(newSelector), newSelector);
	}
});

const elems = new Proxy({}, {
	get: (obj, name: string) =>
		createClassProxy(createMithrilScript(name), name)
}) as Elements;

export default elems;
