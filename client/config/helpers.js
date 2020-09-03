const path = require('path');

const pathTo = function(_path) {
    _path = path.resolve(__dirname, _path);

    return function (args) {
      args = Array.prototype.slice.call(arguments, 0);
      return path.join.apply(path, [_path].concat(args));
    };
};

exports.root = pathTo('..');
exports.src = pathTo('../src');