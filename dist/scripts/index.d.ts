#!/bin/env node
declare global {
    namespace NodeJS {
        interface Global {
            window: undefined;
            document: undefined;
            requestAnimationFrame: undefined;
        }
    }
}
export {};
