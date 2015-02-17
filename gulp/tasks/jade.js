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
	var gutil = require('gulp-util');
	var jade = require('gulp-jade');
	var changed = require('gulp-changed');
	var data = require('gulp-data');
	var reload = require('gulp-inject-reload');
	var plumber = require('gulp-plumber');

	var ip = require('../util/ip');
	var handleErrors = require('../util/handleErrors');

	return gulp.src(config.jade.src)
		.pipe(plumber({errorHandler:handleErrors}))
		.pipe(data(getData))
		.pipe(jade({pretty: false}))

		//Include LiveReload script tag if creating a debug build.
		.pipe(!config.isProduction() ?
			reload({
				host: 'http://' + ip() //Uses the local ip address of this machine, allowing you to use LiveReload on other devices connected to the network. Niceness!
			}) : gutil.noop())

		.pipe(changed(config.dist, {hasChanged: changed.compareSha1Digest}))
		.pipe(gulp.dest(config.dist));
}

function getData() {
	return {
		isProduction: config.isProduction()
	}
}
