#!/bin/env node
declare global {
    namespace NodeJS {
        interface Global {
            window: any;
            document: any;
            requestAnimationFrame: any;
        }
    }
}
export {};
