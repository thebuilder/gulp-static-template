module.exports = function() {
	//Inject all required files
	var gulp         = require('gulp');
	var less         = require('gulp-less');
	var sourcemaps   = require('gulp-sourcemaps');
	var gulpif       = require('gulp-if');
	var plumber      = require('gulp-plumber');

	var config       = require('../config');
	var handleErrors = require('../util/handleErrors');

	/**
	 * Run the task
	 */
	return gulp.src('src/less/*.less')
		// Pass in options to the task
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: getPlugins(process.env.IS_PRODUCTION)
		}))
		//If dev build, include LiveReload server
		.pipe(gulpif(!process.env.IS_PRODUCTION,
			sourcemaps.write({sourceRoot:'http://localhost:'+config.server.port+'/src/'})))
		.pipe(gulp.dest('dist/css'));
};

function getPlugins(release) {
	var LessPluginAutoPrefix = require('less-plugin-autoprefix');

	//Plugins to use
	var plugins = [new LessPluginAutoPrefix({browsers: ["last 2 versions"]})];

	if (release) {
		var LessPluginCleanCSS = require("less-plugin-clean-css");
		plugins.push(new LessPluginCleanCSS({advanced: true}));
	}

	return plugins;
}