# mithril-toolset

Mithril toolset is a collection of utils and extensions I've written to the amazing [Mithril](https://github.com/MithrilJS/mithril.js) UI library.

At the moment, it contains a single export, `elements`, which is a neater syntax to Mithril. I'll demonstrate below:

```JavaScript
// Destructuring to get the elements we need
const { html, head, body, h1, h2, div, p } = require('mithril-toolset').elements;
// Some fancy serverside rendering just to show you
const render = require('mithril-node-render');

render(
  html(
    head(),
    body(
      div.container( // "container" is automatically a class!
        div["#main"]( // "main" is an ID, but you can put in CSS selectors here like "#main.header"
          h1("A neat heading"),
          h2("A subheading"),
          p("Should I also do some Lorem Ipsum?")))))
).then(console.log)
```

Keep in mind that you're not looking at a template engine, you're not looking at some transpiled garbage like JSX. These are purely JavaScript functions. You can pass these functions around, you can split them into components, or whatever it is that you do with regular functions. They interop with Mithril just fine (psst... That's because they __are__ just Mithril wrappers).

More stuff will make it to this toolset as they come along. Have fun Mithril-ing!
