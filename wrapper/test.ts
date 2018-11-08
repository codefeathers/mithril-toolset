// @ts-ignore
import browserMock = require('mithril/test-utils/browserMock'); browserMock(global);

import render from 'mithril-node-render';
import m from './wrapper';

const {h1, h2, div} = m;

render(h1('Hello World')).then(console.log);
