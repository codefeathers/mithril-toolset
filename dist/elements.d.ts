import { Vnode, Children, Attributes } from "mithril";
import elementNames from "./htmlElements";
declare const SELECTOR: unique symbol;
interface MithrilScript {
    (...children: Children[]): Vnode<any, any>;
    (attributes: Attributes, ...children: Children[]): Vnode<any, any>;
    [SELECTOR]: string;
    [key: string]: MithrilScript;
}
declare type Elements = {
    [name in elementNames]: MithrilScript;
};
declare const _default: Elements;
export default _default;
