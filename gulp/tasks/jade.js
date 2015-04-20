var gulp = require('gulp');
var gutil = require('gulp-util');
var cache = require('gulp-cached');
var path = require('path');
var config = require('../config');
var compileError = false;

var cachedData = null;

module.exports = function() {
	//If watch mode, start watching for changes.
	if (config.isWatching()) {
		var watch = require('gulp-watch');

		watch(config.jade.watch, function(file) {
			var fileName = path.basename(file.path);
			var extension = path.extname(file.path);

			//Log changed file
			if (config.logChanges) gutil.log("Changed:", gutil.colors.cyan(fileName));

			var fullRebuild = extension != ".jade";

			if (fileName.charAt(0) == "_" || extension != ".jade") {
				//Clear the cache and rebuild all pages.
				delete cache.caches["jade"];
				cachedData = null;
				fullRebuild = true;
			}
			execute(fullRebuild ? null : file.path);
		});
	}

	return execute();
};

function execute(src) {
	src = src || config.jade.src;
	var jade = require('gulp-jade');
	var changed = require('gulp-changed');
	var data = require('gulp-data');
	var plumber = require('gulp-plumber');
	var es = require('event-stream');

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

		//Write the file out
		.pipe(gulp.dest(config.dist))

		//If BrowserSync instance, reload the stream
		.pipe(config.browserSync ? config.browserSync.stream() : gutil.noop());

}

function getData() {
	if (!cachedData) {
		//Data not cached, rebuild it.
		var json = require('json2object');
		var _ = require('lodash');

		//Fetch all .json files, and create object based on file and directory names.
		cachedData = _.assign(json.getObject(config.jade.data), {
			//Merge the following global vars into data
			isProduction: config.isProduction()
		});
	}

	return cachedData;
}
