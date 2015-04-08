var es = require('event-stream');
var path = require('path');

var gutil = require('gulp-util');
var config = require('../config');

module.exports = function(label) {
	return es.map(function(file, cb) {
		gutil.log((label ? label : "File") + ": " + gutil.colors.magenta(path.relative(config.dist, file.path)));
		cb(null, file);
	});
};