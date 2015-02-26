var config = require('../config');

/**
 * Copy all assets that should not be processed.
 * @returns {*}
 */
module.exports = function() {
	//If watch mode, start watching for changes.
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		watch(config.assets.src, copyAssets);
	}

	return copyAssets();
};

function copyAssets() {
	var gulp	     = require('gulp');
	var changed      = require('gulp-changed');
	var plumber      = require('gulp-plumber');

	return gulp.src(config.assets.src)
		.pipe(plumber())
		.pipe(changed(config.dist)) // Ignore unchanged files
		.pipe(gulp.dest(config.dist));
};
