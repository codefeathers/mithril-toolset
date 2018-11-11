import m, { Vnode, Children, Attributes } from 'mithril';
import elementNames from '../assets/htmlElements';

/* Creates a virtual element (Vnode). */
interface MithrilScript {
	(...children: Children[]): Vnode<any, any>;
	(attributes: Attributes, ...children: Children[]): Vnode<any, any>;
	[key: string]: MithrilScript;
}

function createMithrilScript (selector: string): MithrilScript
function createMithrilScript (selector: string) {
	return (...args: any[]) => m(selector, ...args);
}

type Elements = { [name in elementNames]: MithrilScript }

const createClassProxy = (m: MithrilScript, name: string): MithrilScript => new Proxy(m, {
	get: (f, selector: string) => {
		if (selector in f) return f[selector];
		const isPureClass =
			selector.split('.').length === 1
			&& selector.split('#').length === 1;
		const newSelector = name + `${isPureClass ? '.' : ''}${selector}`;
		return createClassProxy(createMithrilScript(newSelector), newSelector);
	}
});

export default new Proxy({}, {
	get: (obj, name: string) =>
		createClassProxy(createMithrilScript(name), name)
}) as Elements;
