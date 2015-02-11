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
	var gulp         = require('gulp');
	var gutil        = require('gulp-util');
	var less         = require('gulp-less');
	var sourcemaps   = require('gulp-sourcemaps');
	var plumber      = require('gulp-plumber');
	var handleErrors = require('../util/handleErrors');

	return gulp.src('src/less/*.less')
		// Pass in options to the task
		.pipe(sourcemaps.init())

		.pipe(less({
			plugins: getPlugins()
		}))

		//If dev build, include LiveReload server
		.pipe(process.env.IS_PRODUCTION ? sourcemaps.write({sourceRoot:'http://localhost:'+config.server.port+'/src/'}) : gutil.noop())
		.pipe(gulp.dest('dist/css'));
}

/**
 * Get the LESS plugins to use.
 * @returns {*[]}
 */
function getPlugins() {
	var LessPluginAutoPrefix = require('less-plugin-autoprefix');
	var LessPluginCleanCSS = require("less-plugin-clean-css");

	//Plugins to use
	var plugins = [];
	plugins.push(new LessPluginAutoPrefix({browsers: ["last 2 versions"]}));

	if (process.env.IS_PRODUCTION) {
		plugins.push(new LessPluginCleanCSS({advanced: true}));
	}

	return plugins;
}