var gulp = require("gulp");
var gutil = require("gulp-util");
var path = require("path");
var fs = require('fs');
var source = require('vinyl-source-stream');
var es = require('event-stream');
var _ = require('lodash');

var handleErrors = require("../util/handleErrors");
var config = require('../config');

//This node modules will not be included in the vendor file, even if they are present in the package.json dependencies field.
//Use for modules without .js, like normalize.css.
var excludedModules = ['normalize.css', 'bootstrap'];
var watchStream = null;
var compileError = false;
var logChanges = false;

//Setup options
var opts = {
	debug:!config.isProduction(),
	extensions: [".js"],
	fullPaths: false //Set fullpaths to false - Otherwise the files full path is used as the index.
};

/**
 * Exprort the stream creator.
 * @returns {*|Stream}
 */
module.exports = function() {
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		//Create a watch stream. It will trigger execute when a file is changed
		watchStream = watch('package.json', packageVendor);
	}

	return es.merge(
		packageApplication(),
		packageVendor()
	);
};

/**
 * Compile the main app.js file.
 * @returns {*}
 */
function packageApplication() {
	//Require Browserify
	var browserify = require('browserify');
	var watchify = require('watchify');

	var bundler;
	if (config.isWatching()) {
		bundler = watchify(browserify(_.assign(watchify.args, opts)));
	} else {
		bundler = browserify(opts);
	}

	//Add the assets - e.g. app.js
	bundler.add(path.resolve(config.js.src));

	//Add external libs, they are provided by the vendor.js file.
	addExternalLibs(bundler);

	//Add transforms for production
	if (config.isProduction()) addProdTransforms(bundler);

	//Start watching
	if (config.isWatching()) {
		if (logChanges) bundler.on('update', logFiles);
		bundler.on('update', function() {
			//On updates, rebundle the app.
			bundle(bundler, 'app');
		});
	}

	return bundle(bundler, 'app');
}

/**
 * Package a vendor.js file, that contains the external libs used in the project.
 * @returns {*}
 */
function packageVendor() {
	//Require Browserify
	var browserify = require('browserify');
	var bundler = browserify(opts);

	addRequiredLibs(bundler);

	//Add transforms for production
	if (config.isProduction()) addProdTransforms(bundler);

	return bundle(bundler, 'vendor');
}

function addExternalLibs(bundler) {
	//Read package.json
	var pck = JSON.parse(fs.readFileSync('package.json', 'utf8'));

	//Add all browser packages as external dependencies
	_.forEach(pck.browser, function(path, key) {
		bundler.external(key);
	});

	//Add all node dependencies as external dependencies
	_.forEach(pck.dependencies, function(path, key) {
		bundler.external(key);
	});
}

function addRequiredLibs(bundler) {
	//Read package.json
	var pck = JSON.parse(fs.readFileSync('package.json', 'utf8'));

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
function bundle(bundler, name) {
	return bundler.bundle()
		.on('error', function(error) {
			handleErrors(error); //Break the pipe by placing error handler outside
			compileError = true;
			this.emit('end');
		})
		//Output the .js file
		.pipe(source(config.isProduction() ? name + '.min.js' : name + '.js'))
		.pipe(gulp.dest(config.dist + 'js'))

		//Notify the user on successful compile, after an error
		.pipe(compileError ? es.map(function(file, cb) {
			if (compileError) gutil.log(gutil.colors.green("JS compiled"));
			compileError = false;
		}) : gutil.noop());
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