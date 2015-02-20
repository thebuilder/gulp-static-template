var gulp = require('gulp');
var config = require('../config');

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
	var changed = require('gulp-changed');
	var data = require('gulp-data');
	var plumber = require('gulp-plumber');

	var handleErrors = require('../util/handleErrors');

	return gulp.src(config.jade.src)
		.pipe(plumber({errorHandler:handleErrors}))
		.pipe(data(getData))
		.pipe(jade({pretty: false}))
		.pipe(changed(config.dist, {hasChanged: changed.compareSha1Digest}))
		.pipe(gulp.dest(config.dist));
}

function getData() {
	return {
		isProduction: config.isProduction()
	}
}
