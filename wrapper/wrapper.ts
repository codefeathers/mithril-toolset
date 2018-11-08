import m from 'mithril';
import htmlElements from '../assets/htmlElements.json';
import elementNames from '../assets/htmlElements';

type Elements = { [name in elementNames]: (...children: string[]) => m.Vnode }

const elems = htmlElements.reduce(
	(elements: object, el: string): Elements => (
		{ ...elements, [el]: (...children: string[]) => m(el, ...children)} as Elements
	), {}
) as Elements;

export default elems;
