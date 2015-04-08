var gulp = require('gulp');
var config = require('../config');
var compileError = false;

module.exports = function() {
	//If watch mode, start watching for changes.
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		watch(config.jade.watch, execute);

	}

	return execute();
};

function execute() {
	var jade = require('gulp-jade');
	var gutil = require('gulp-util');
	var changed = require('gulp-changed');
	var data = require('gulp-data');
	var plumber = require('gulp-plumber');
	var browserSync = require('browser-sync');
	var es 		= require('event-stream');

	var handleErrors = require('../util/handleErrors');

	return gulp.src(config.jade.src)
		.pipe(plumber({errorHandler:function(args) {
			compileError = true;
			handleErrors(args);
		}}))
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

		.on('end', function(e) {
			//Reload the browser after .html files have been compiled. Otherwise you can run into timing issues.
			browserSync.reload();
		})

}

function getData() {
	return {
		isProduction: config.isProduction()
	}
}
