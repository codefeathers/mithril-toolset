require('mithril/test-utils/browserMock')(global);

var render = require('mithril-node-render')
const { h1, h2, div } = require('./wrapper');

render(h1('Hello World')).then(console.log);