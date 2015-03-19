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
	var svg2png   	= require('gulp-svg2png');
	var changed    	= require('gulp-changed');
	var plumber    	= require('gulp-plumber');
	var filter    	= require('gulp-filter');
	var es    		= require('event-stream');

	var jpegRecompress = require('imagemin-jpeg-recompress');

	var handleErrors = require('../util/handleErrors');

	var filterUnlinked = filter(onFilterUnlinked);

	return stream
		.pipe(plumber({errorHandler:handleErrors}))
		.pipe(changed(config.dist + config.img.dir)) // Ignore unchanged files

		//Delete unlinked files from dist
		.pipe(filterUnlinked)
		.pipe(es.map(deleteUnlinkedImage))
		.pipe(filterUnlinked.restore())

		//Minify the images
		.pipe(imagemin({
			progressive: true,
			use: [jpegRecompress({
				// Compress .jpg images - Ensures a quality 100% Photoshop image is changed to a more sane quality level.
				// See https://github.com/imagemin/imagemin-jpeg-recompress for options. You can configure min/max quality target etc.
			})]
		}))

		//Output all the images
		.pipe(gulp.dest(config.dist + config.img.dir))

		//Convert all SVG files to PNG, and output into the image directory.
		//Allows you create .png fallbacks in browsers without .svg support
		.pipe(filter('**/*.svg'))
		.pipe(svg2png())
		.pipe(gulp.dest(config.dist + config.img.dir));
}

/**
 * Delete a file from the dist directory, once it is removed from the src directory
 * @param file
 * @param cb
 */
function deleteUnlinkedImage(file, cb) {
	var del    		= require('del');
	var path 		= require('path');
	var gutil 		= require('gulp-util');

	var distPath = file.path.replace(config.src, config.dist);
	var pathsToDel = [distPath];

	//.svg's should also delete the .png
	if (path.extname(distPath) == '.svg') {
		//Add the .png path
		pathsToDel.push(distPath.replace('.svg', '.png'));
	}

	//Delete all the unlinked images.
	del(pathsToDel, function (err, deletedFiles) {
		gutil.log('Images deleted from dist:\n' + gutil.colors.magenta(deletedFiles.join('\n')));
		cb()
	});
}

function onFilterUnlinked(file) {
	return file.event == 'unlink';
}