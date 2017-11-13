
var async = require('async');
var assert = require('assert');
var vm = require('vm');
var browserify = require('browserify');
var shimmy = require('../');
var pathToTestSrc = __dirname+"/src/index.js";
var context = {
  assert: assert,
  window: {
    A: { name: "a" }
  }
};

async.series(
  [
    function (cb) {
      console.log("Testing regular bundle...");
      var bundle = browserify(pathToTestSrc);
      bundleToString(bundle, function(err, js){
        assert.ok(!err, "Unexpected error: "+err);
        assert.ok(js.indexOf("THIS_CODE_SHOULD_NOT_BE_BUNDLED") > -1, "node_modules/a should be in the bundle!");
        assert.throws(() => {
          vm.runInNewContext(js, context);
        }, /window.A !== a/);
        cb();
      });
    },

    function (cb) {
      console.log("Testing shimmy bundle...");
      var shimmySettings = { "a": "module.exports = window.A;" };
      var bundle = browserify(pathToTestSrc).plugin(shimmy, shimmySettings);
      bundleToString(bundle, function(err, js){
        assert.ok(!err, "Unexpected error: "+err);
        assert.ok(js.indexOf("THIS_CODE_SHOULD_NOT_BE_BUNDLED") === -1, "node_modules/a should not be in the bundle!");
        vm.runInNewContext(js, context);
        cb();
      });
    }
  ],
  function(err){
    if (err) {
      console.log("FAIL:");
      console.log(err);
      process.exit(1);
    }else{
      console.log("SUCCESS");
      process.exit(0);
    }
  }
);

function bundleToString(bundle, callback){
  bundle.bundle(function(err, buffer){
    if (!callback) return; //browserify calls back multiple times with errors (ugh...)
    var str = buffer ? buffer.toString("UTF8") : null;
    callback(err, str);
    callback = null;
  });
};