var gulp 	   	= require('gulp');
var config     	= require('../config');

module.exports = function() {
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		//Create a watch stream. It will trigger execute when a file is changed
		execute(watch(config.img.src));
	}

	return execute(gulp.src(config.img.src));
};

/**
 * Stream of image files to process
 * @param stream
 * @returns {*}
 */
function execute(stream) {
	var imagemin   	= require('gulp-imagemin');
	var changed    	= require('gulp-changed');
	var plumber    	= require('gulp-plumber');
	var filter    	= require('gulp-filter');
	var es    		= require('event-stream');
	var del    		= require('del');
	var path 		= require('path');

	var filterUnlinked = filter(onFilterUnlinked);

	return stream
		.pipe(plumber())
		.pipe(changed(config.dist + config.img.dir)) // Ignore unchanged files

		//Delete unlinked files from dist
		.pipe(filterUnlinked)
		.pipe(gulp.dest(config.dist + config.img.dir))
		.pipe(es.map(function(file, cb) {
			del(file.path, cb);
		}))
		.pipe(filterUnlinked.restore())
		//Process the images
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(gulp.dest(config.dist + config.img.dir));
}

function onFilterUnlinked(file) {
	return file.event == 'unlink';
}