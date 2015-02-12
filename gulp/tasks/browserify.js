var gulp = require("gulp");
var gutil = require("gulp-util");
var path = require("path");
var source = require('vinyl-source-stream');
var _ = require('lodash');

var config = require('../config');

module.exports = function() {
	//Require Browserify
	var browserify = require('browserify');
	var watchify = require('watchify');

	//Setup options
	var watch = config.isWatching();
	var logChanges = false;
	var opts = {
		debug:!config.isProduction(),
		extensions: [".js"],
		fullPaths: false //Set fullpaths to false - Otherwise the files full path is used as the index.
	};

	var bundler;
	if (watch) {
		bundler = watchify(browserify(_.assign(watchify.args, opts)));
	} else {
		bundler = browserify(opts);
	}

	//Add the assets - e.g. app.js
	bundler.add(path.resolve(config.js.src));

	//Add transforms for production
	if (config.isProduction()) addProdTransforms(bundler);

	//Start watching
	if (watch) {
		if (logChanges) bundler.on('update', logFiles);
		bundler.on('update', function() {
			bundle(bundler);
		});
	}

	return bundle(bundler);
};

function addProdTransforms(bundler) {
	//Uglify when compiling for release
	bundler.transform({
		global: true,
		mangle: false,
		exts: [".js"], //Only uglify .js files. Would break if .html or .json are required.
		ignore: []
	}, 'uglifyify');
}

/**
 * Bundle all the JS files.
 */
function bundle(bundler) {
	return bundler.bundle()
		.on('error', function(error) {
			gutil.log(gutil.colors.red(error.annotated)); //annotated contains useful info to determine where the error occured
			gutil.beep();
		})
		.pipe(source(config.isProduction() ? 'app.min.js' : 'app.js'))
		.pipe(gulp.dest(config.dist + config.js.dir))
}

/**
 * Console log all files in the array.
 * @param files {Array}
 */
function logFiles(files) {
	if (files) {
		for (var i = 0; i < files.length; i++) {
			gutil.log("Watchify: " + gutil.colors.magenta(path.relative(config.src, files[i])));
		}
	}
}