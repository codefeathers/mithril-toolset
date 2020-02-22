const assert = require("assert");

if (!global.window) {
	global.window = global.document = global.requestAnimationFrame = undefined;
}

const render = require("mithril-node-render");

const {
	elements: { html, head, body, div, h1, h2, p },
	maybe,
} = require("./dist");

const testHTML =
	'<html><head></head><body class="container"><div id="id" class="hello world"><h1 id="main-title" class="title">Hello World</h1><h2>Subheading</h2><p>This is some text</p></div></body></html>';

render(
	html(
		head(),
		body[".container"][maybe(5 === "5" && "classname")](
			div.hello.world[maybe(5 === 5 && "#id")](
				h1.title["#main-title"]("Hello World"),
				h2("Subheading"),
				p("This is some text"),
			),
		),
	),
)
	.then(html => {
		assert.equal(html, testHTML);
	})
	.then(() => {
		console.log("> [info] Test passed!");
	})
	.catch(console.error);
