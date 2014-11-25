var gulp         = require('gulp');

gulp.task('less', function () {
    //Require in task, to improve startup time
    var less         = require('gulp-less');
    var autoprefixer = require('gulp-autoprefixer');
    var sourcemaps   = require('gulp-sourcemaps');
    var gulpif       = require('gulp-if');
    var plumber      = require('gulp-plumber');
    var minifyCSS    = require('gulp-minify-css');

    var config       = require('../config');
    var handleErrors = require('../util/handleErrors');

    return gulp.src(config.less.src)
        .pipe(plumber({errorHandler:handleErrors}))

        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({cascade:false}))
        .pipe(gulpif(!config.isReleaseBuild, sourcemaps.write({includeContent: false, sourceRoot:'http://localhost:'+config.server.port+'/src/less/'})))

		.pipe(gulpif(config.isReleaseBuild, minifyCSS({keepBreaks:false})))
		.pipe(gulp.dest(config.dist + config.less.dir))
});