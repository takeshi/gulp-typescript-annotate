var modify = require('./lib/class-modify');
var through = require('through2');
module.exports = function (opts) {
    opts = opts || {};
    var stream = through.obj(function (file, enc, cb) {
        if (file.isBuffer()) {
            var contents = file.contents.toString();
            contents = modify.transform(contents, opts.typesafe, opts.forceLowerCase);
            file.contents = new Buffer(contents.toString());
        }
        this.push(file);
        return cb();
    });
    return stream;
};
