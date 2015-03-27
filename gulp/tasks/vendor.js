var gulp = require("gulp");
var handleErrors = require("../util/handleErrors");
var source = require('vinyl-source-stream');
var _ = require('lodash');
var config = require('../config');
var watchStream = null;

//This node modules will not be included in the vendor file, even if they are present in the package.json dependencies field.
//Use for modules without .js, like normalize.css.
var excludedModules = ['normalize.css', 'bootstrap'];

module.exports = function() {
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		//Create a watch stream. It will trigger execute when a file is changed
		watchStream = watch('package.json', packageVendor);
	}

	return packageVendor();
};

function packageVendor() {
	//Require Browserify
	var browserify = require('browserify');
	var path = require('path');
	var fs = require('fs');

	//Read package.json
	var pck = JSON.parse(fs.readFileSync('package.json', 'utf8'));

	//Setup options
	var opts = {
		debug:!config.isProduction(),
		extensions: [".js"],
		fullPaths: false //Set fullpaths to false - Otherwise the files full path is used as the index.
	};

	var bundler = browserify(opts);

	//Add all browser packages as required libs
	_.forEach(pck.browser, function(path, key) {
		bundler.require(path, {expose: key});
		if (watchStream) watchStream.add(path); //Watch file for changes?
	});

	//Add all package dependencies as required libs
	_.forEach(pck.dependencies, function(path, key) {
		if (_.indexOf(excludedModules, key) == -1) {
			bundler.require(key)
		}
	});

	//Add transforms for production
	if (config.isProduction()) addProdTransforms(bundler);

	return bundle(bundler);
}
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
		.on('error', function (error) {
			handleErrors(error); //Break the pipe by placing error handler outside
			this.emit('end');
		})
		//Output the .js file
		.pipe(source(config.isProduction() ? 'vendor.min.js' : 'vendor.js'))
		.pipe(gulp.dest(config.dist + 'js'))
}