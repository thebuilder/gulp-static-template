var gulp = require('gulp');
var cache = require('gulp-cached');
var config = require('../config');
var compileError = false;

module.exports = function() {
	//If watch mode, start watching for changes.
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		watch(config.jade.watch, function(file) {
			var fileName = file.path.substring(file.path.lastIndexOf("/") + 1);

			if (fileName.charAt(0) == "_") {
				//Clear the cache an include file was changed.
				delete cache.caches["jade"];
				execute();
			} else {
				//Only a page changed. Compile it.
				execute(file.path);
			}
		});
	}

	return execute();
};

function execute(src) {
	src = src || config.jade.src;
	var jade = require('gulp-jade');
	var gutil = require('gulp-util');
	var changed = require('gulp-changed');
	var data = require('gulp-data');
	var plumber = require('gulp-plumber');
	var browserSync = require('browser-sync');
	var es 		= require('event-stream');

	var handleErrors = require('../util/handleErrors');

	return gulp.src(src, {base:config.jade.base})
		.pipe(plumber({errorHandler:function(args) {
			compileError = true;
			handleErrors(args);
		}}))
		.pipe(cache('jade'))
		.pipe(data(getData))
		.pipe(jade({pretty: false}))

		//Notify the user on successful compile, after an error
		.pipe(compileError ? es.map(function(file, cb) {
			if (compileError) gutil.log(gutil.colors.green("JADE compiled"));
			compileError = false;
		}) : gutil.noop())

		//Only write out changed files.
		.pipe(changed(config.dist, {hasChanged: changed.compareSha1Digest}))

		.pipe(gulp.dest(config.dist))
		//
		//.on('end', function(e) {
		//	//Reload the browser after .html files have been compiled. Otherwise you can run into timing issues.
		//	browserSync.reload();
		//})

}

function getData() {
	return {
		isProduction: config.isProduction()
	}
}
