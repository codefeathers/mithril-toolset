export declare type Falsy = false | "" | 0 | 0n | undefined | null;
export declare const join: (...segs: (string | false | 0 | 0n | null | undefined)[]) => string;
export declare const Memo: <T>() => {
    call: (f: Function, arg: string) => any;
};
