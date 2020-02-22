const assert = require("assert");

const equal = target => source => assert.equal(source, target);

const pass = str => () => console.log(`> [info] Test passed! ${str}`);

const error = (str = "") => err => {
	console.error(`> [err] Test failed! ${str}`);
	process.exitCode = 1;
	throw err;
};

if (!global.window) {
	global.window = global.document = global.requestAnimationFrame = undefined;
}

const render = require("mithril-node-render");

const { elements, maybe } = require("./dist");

const { html, head, body, div, h1, h2, p } = elements;

const testHTML =
	'<html><head></head><body class="container"><div id="id" class="hello world"><h1 id="main-title" class="title">Hello World</h1><h2>Subheading</h2><p>This is some text</p></div></body></html>';

const empty = "";

render(
	html(
		head(),
		body[".container"][maybe(5 === "5" && "classname")](
			div.hello.world[empty][maybe(5 === 5 && "#id")](
				h1.title["#main-title"]("Hello World"),
				h2("Subheading"),
				p("This is some text"),
			),
		),
	),
)
	.then(equal(testHTML))
	.then(pass("Renders HTML correctly"))
	.catch(error("Render failed"));

Promise.resolve(elements.html)
	.then(equal(elements.html))
	.then(pass("Elements are cached"))
	.catch(error("Elements are not cached"));

Promise.resolve(elements.html.a.b)
	.then(equal(elements.html.a.b))
	.then(error("MithrilScript was cached!"))
	.catch(pass("MithrilScript was not cached"));
