var gulp = require('gulp');
var watch = require('gulp-watch');
var gulpif = require('gulp-if');
var jade = require('gulp-jade');
var changed = require('gulp-changed');
var data = require('gulp-data');
var reload = require('gulp-inject-reload');
var plumber = require('gulp-plumber');

var ip = require('../util/ip');
var handleErrors = require('../util/handleErrors');
var config = require('../config');

module.exports = function() {
	var stream = gulp.src(config.jade.src);
	return compile(stream);
};

/**
 * Compile a stream of Jade files.
 * @param stream
 * @returns {*}
 */
function compile(stream) {
	return stream.pipe(plumber({errorHandler:handleErrors}))
		.pipe(data(getData))
		.pipe(jade({pretty: false}))

		//Include LiveReload script tag if creating a debug build.
		.pipe(gulpif(process.env.IS_PRODUCTION, reload({
				host: 'http://' + ip() //Uses the local ip address of this machine, allowing you to use LiveReload on other devices connected to the network. Niceness!
			}
		)))

		.pipe(changed(config.dist, {hasChanged: changed.compareSha1Digest}))
		.pipe(gulp.dest(config.dist));
}

function getData() {
	return {
		isProduction: process.env.IS_PRODUCTION
	}
}
