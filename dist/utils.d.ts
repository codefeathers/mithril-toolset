export declare type Falsy = false | "" | 0 | 0n | undefined | null;
export declare const join: (...segs: (string | false | 0 | 0n | null | undefined)[]) => string;
export declare const Memo: <T>() => {
    call: (f: Function, arg: string) => any;
};
export declare const convertToFilename: (name: string, ext: string) => string;
export declare const getFiles: (ext: string) => (name: string, CSS: string) => string[];
