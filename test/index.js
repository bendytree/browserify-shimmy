
var async = require('async');
var assert = require('assert');
var vm = require('vm');
var browserify = require('browserify');
var shimmy = require('../');
var pathToTestSrc = __dirname+"/src/index.js";

async.series(
  [
    function (cb) {
      console.log("Should fail to load without plugin...");
      var bundle = browserify(pathToTestSrc);
      bundleToString(bundle, function(err, js){
        assert.ok(String(err).indexOf("Cannot find module 'target-lib'") > -1);
        cb();
      });
    },
    function (cb) {
      console.log("Should succeed with plugin...");
      var shimmySettings = { "target-lib": "module.exports = window.TargetLib;" };

      var bundle = browserify(pathToTestSrc).plugin(shimmy, shimmySettings);
      bundleToString(bundle, function(err, js){
        assert.ok(!err);
        vm.runInNewContext(js, {window:{}});
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