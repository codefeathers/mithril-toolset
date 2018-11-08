declare module 'mithril-node-render' {
	import m from 'mithril';
	function render (m: m.Vnode): Promise<string>;
	export default render;
}
