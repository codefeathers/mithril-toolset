import { Vnode, Children, Attributes } from "mithril";
import elementNames from "./htmlElements";
declare const Selector: unique symbol;
declare const False: unique symbol;
declare type False = typeof False;
interface MithrilScript {
    (...children: Children[]): Vnode<any, any>;
    (attributes: Attributes, ...children: Children[]): Vnode<any, any>;
    [Selector]: string;
    [False]: MithrilScript;
    [key: string]: MithrilScript;
}
declare type Elements = {
    [name in elementNames]: MithrilScript;
};
declare function MithrilScript(selector: string): MithrilScript;
export declare const maybe: (x: string | false | 0 | 0n | null | undefined) => string | typeof False;
export declare const elements: Elements;
export {};
