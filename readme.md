# browserify-shimmy

A browserify plugin that lets you use a CDN for `react` or `jQuery`, but still "require"
it like normal. For example:

    // Your code:
    var react = require("react");

    // Becomes this:
    var react = window.React;

What makes `shimmy` special is that it also works on code in `node_modules`.

> Shimmy is designed/tested with Browserify `14.5.0` but should work on any version.

# The Problem

Say you're using `react` and `react-dnd`.  React takes a long time to bundle and to download,
so you want to reference it from a CDN. So you do this:

    // index.html
    ...
    <script src="//somecdn.com/react.js"></script>
    <script src="app.js"></script>
    ...

    // app.js
    var react = require("react");
    var dragAndDrop = require("react-dnd");
    ...

So `react` will load on `window.React` (from the CDN). But wait... when you browserify
`app.js`, it will include react in the bundle.

What you want is to remove `react` from you bundle and have your code use `window.React` instead.

So you use the `browserify-shim` transform, but it doesn't work. Why? Because it's a transform.
Transforms only change your code - they don't impact node_modules code. So your code will
reference the CDN version of react, and the `react-dnd` will reference the bundled version.
Now you have two different copies of react running at the same time.

Instead, `shimmy` is a plugin which is able to change **all** of the references - even
the ones in `node_modules`.


# Usage

Install like this: (not on npm yet)

    npm i browserify-shimmy --save-dev

Use it like this:

    var shimmy = require("browserify-shimmy");

    var settings = {
      "react": "module.exports = window.React",
      "react-dom": "module.exports = window.ReactDom",
    };

    browserify(src).plugin(shimmy, settings).bundle(...);

So basically you can override the source for each module.

In this example, we're loading react from a cdn and then
any time `require('react')` is called, it uses window.React
which is from the CDN.


# Alternatives

There are a lot of alternatives, so I'll explain why they don't work for this scenario...

#### browserify.ignore

The `ignore` options successfully removes the library from the bundle and replaces
it with an empty stub (e.g. `module.exports = {};`). But now if you call `require('react')`
then you will get an empty stub, not a reference to `window.React`.

#### browserify.exclude

Much like the `ignore` option, this removes the library from your bundle. But now if you
call `require('react')` then there will be a runtime exception because the module does
not exist at all.

#### browserify.browser

The `browser` option does exactly what you want. It replaces `require('react')` with
a reference to `window.React`. Unfortunately, it is basically just a browserify transform
meaning it will only impact **your** code and not the code in `node_modules`. So if you
use a node module that references `react` then you'll get a bundle error.

#### browserify-shim

Browserify-shim is designed to exactly the same thing as `browserify-shimmy`. The problem
is that it is a transform - which, again, means it is only used on your code - not the code
in node_modules.

Also, browserify-shim forces you to use global configuration (through package.json) which
makes testing or multiple bundle configurations nearly impossible.

# Testing

Run `npm test`.

# Questions

@bendytree
