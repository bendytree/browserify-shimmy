
var through = require("through2");

module.exports = function (bundle, options) {

  var shims = [];

  for (var key in options){
    if (!options.hasOwnProperty(key)) continue;

    shims.push({key:key,value:options[key]});
  }

  if (!shims.length) return bundle;

  shims.forEach(shim=>{
    bundle.exclude(shim.key);
  });

  var rows = [];

  bundle.pipeline.get("deps").push(through.obj(
    function onRow(row, enc, callback) {
      rows.push(row);
      callback(null, null);
    },
    function onEnd(cb){
      shims.forEach(shim=>{
        rows.splice(0, 0, {
          id: shim.key,
          source: shim.value,
          deps: {},
          file: "",
        });
      });

      rows.forEach(row=>{
        for (var key in row.deps){
          var shim = shims.find(s => s.key === key);
          if (!shim) continue;
          row.deps[key] = key;
        }

        this.push(row);
      });

      cb();
    }
  ));

  return bundle;
};
