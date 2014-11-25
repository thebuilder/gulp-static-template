var gulp         = require('gulp');

/**
 * Copy all assets from the following dirs to build directory
 **/
gulp.task('assets', function () {
    var changed      = require('gulp-changed');
    var plumber      = require('gulp-plumber');
    var config       = require('../config');

	//Cleanup
	require('../util/removeUnused')(config.assets.src, {cwd:config.dist, base:config.dist});

    return gulp.src(config.assets.src, {cwd:config.src, base:"./src"})
        .pipe(plumber())
        .pipe(changed(config.dist)) // Ignore unchanged files
        .pipe(gulp.dest(config.dist));
});
