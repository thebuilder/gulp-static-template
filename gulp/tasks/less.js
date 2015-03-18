var gulp         = require('gulp');
var gutil        = require('gulp-util');
var config       = require('../config');
var compileError = false;

module.exports = function() {
	//If watch mode, start watching for changes.
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		watch(config.less.watch, execute);
	}

	//Execute the less task
	return execute();
};

/**
 * Run the task
 */
function execute() {
	//Inject all required files
	var less         = require('gulp-less');
	var rename       = require('gulp-rename');
	var sourcemaps   = require('gulp-sourcemaps');
	var plumber      = require('gulp-plumber');
	var es 			 = require('event-stream');
	var handleErrors = require('../util/handleErrors');

	return gulp.src(config.less.src)
		.pipe(plumber({errorHandler:function(args) {
			compileError = true;
			handleErrors(args);
		}}))
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: getPlugins()
		}))

		.pipe(!config.isProduction() ? sourcemaps.write() : gutil.noop())
		.pipe(config.isProduction() ? rename(function(file) {
			file.basename += ".min";
		}) : gutil.noop())
		.pipe(gulp.dest(config.dist + 'css'))

		//Notify the user on successful compile, after an error
		.pipe(compileError ? es.map(function(file, cb) {
			if (compileError) gutil.log(gutil.colors.green("LESS compiled"));
			compileError = false;
		}) : gutil.noop());
}

/**
 * Get the LESS plugins to use.
 * @returns {*[]}
 */
function getPlugins() {
	var LessPluginAutoPrefix = require('less-plugin-autoprefix');

	//Plugins to use
	var plugins = [];
	plugins.push(new LessPluginAutoPrefix({browsers: ["last 2 versions"]}));

	if (config.isProduction()) {
		var LessPluginCleanCSS = require("less-plugin-clean-css");
		plugins.push(new LessPluginCleanCSS({advanced: true}));
	}

	return plugins;
}
