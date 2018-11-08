declare module 'mithril-node-render' {
	import Mithril from 'mithril';
	function render (m: Mithril.Vnode): Promise<string>;
	export default render;
}
