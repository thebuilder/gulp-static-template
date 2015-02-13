var gulp         = require('gulp');
var gutil        = require('gulp-util');
var config       = require('../config');

module.exports = function() {
	//If watch mode, start watching for changes.
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		watch('src/less/**/*.less', execute);
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
	var handleErrors = require('../util/handleErrors');

	return gulp.src('src/less/*.less')
		// Pass in options to the task
		.pipe(plumber({errorHandler:handleErrors}))
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: getPlugins()
		}))

		//If dev build, include LiveReload server
		.pipe(!config.isProduction() ? sourcemaps.write({sourceRoot:'http://localhost:'+config.server.port+'/src/'}) : gutil.noop())
		.pipe(config.isProduction() ? rename(function(file) {
			file.basename += ".min";
		}) : gutil.noop())
		.pipe(gulp.dest('dist/css'));
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
