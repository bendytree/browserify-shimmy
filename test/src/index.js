
var a = require("a");
var b = require("b");

var assert = function (truth, msg) {
  if (!truth) throw new Error(msg);
};

assert(typeof a === "object", "a is not an object");
assert(a.name === "a", "a is not named");
assert(typeof b === "object", "b is not an object");
assert(b.name === "b", "b is not named");
assert(typeof b.a === "object", "b.a is not an object");
assert(b.a.name === "a", "b.a is not named");
assert(b.a === a, "b.a !== a");
assert(window.A === a, "window.A !== a");
