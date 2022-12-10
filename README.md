### ⚠️ This project is abandoned! As a continuation of this library, we built [hyperactive⚡️](https://github.com/feathers-studio/hyperactive), a new reactive UI library. Go check that out!

# mithril-toolset

Mithril toolset is a collection of utils and extensions I've written to the amazing [Mithril](https://github.com/MithrilJS/mithril.js) UI library.

It's better when I demonstrate it:

```JavaScript
// Destructuring to get the elements we need
const { elements: { html, head, body, h1, h2, div, p } } = require("mithril-toolset");
// fancy serverside rendering for an example
const render = require("mithril-node-render");

render(
  html(
    head(),
    body(
      div.container( // "container" is automatically a class!
        div["#main"]( // "main" is an ID, but you can put in CSS selectors here like "#main.header"
          h1("A neat heading"),
          h2("A subheading"),
          p("Should I also do some Lorem Ipsum?")))))
).then(console.log);
```

If you want to use optional classes, mithril-toolset 0.4 adds support for a `maybe`.

```JavaScript
const { maybe, elements: { div } } = require("mithril-toolset");

const component = hidden =>
      div[maybe(hidden && ".hide")](
        "If hidden is truthy, the class 'hide' is added to this div"))));
```

Attempting to use an empty selector returns the same component (although a copy to avoid reference sharing).

```JavaScript
div[""] // identical to div

div[""] === div[""] // false. Every invocation creates a new reference, similar to Symbol
```

`mithril-toolset` has full TypeScript support. Even if you don't use TS, it helps with VSCode's IntelliSense.

`mithril-toolset`, like mithril itself, does not require any transpilation. Unlike JSX, t's fully valid JavaScript that you can use in runtime directly. You can pass these functions around, you can split them into components, or whatever it is that you do with regular functions.

More stuff will make it to this toolset as they come along. Have fun Mithril-ing!
