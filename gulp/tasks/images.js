var gulp       = require('gulp');

/**
 * Minify images and copy to dist directory.
 */
gulp.task('images', function() {
    var changed    = require('gulp-changed');
    var imagemin   = require('gulp-imagemin');
	var plumber    = require('gulp-plumber');
	var config     = require('../config');

	//Cleanup
	require('../util/removeUnused')(config.dist + config.img.dir + '/**/{*.png,*.jpg,*.gif,*.svg,*.ico}');

    return gulp.src(config.img.src)
        .pipe(plumber())
        .pipe(changed(config.dist + config.img.dir)) // Ignore unchanged files
        .pipe(imagemin({
			progressive: true
		})) // Optimize
        .pipe(gulp.dest(config.dist + config.img.dir));
});
