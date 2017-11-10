#browserify-shimmy

A browserify plugin that lets you turn this:

    var react = require("react");

Into this:

    var react = window.React;

#Usage

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


#Alternatives

There are a lot of alternatives, so I'll explain why they don't work...

#### browserify.ignore

#### browserify.exclude

#### browserify.browser

#### browserify-shim

