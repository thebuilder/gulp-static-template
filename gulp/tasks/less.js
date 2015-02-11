var gulp         = require('gulp');

gulp.task('less', function () {
    //Require in task, to improve startup time
    var less         = require('gulp-less');
    var sourcemaps   = require('gulp-sourcemaps');
    var gulpif       = require('gulp-if');
    var plumber      = require('gulp-plumber');

    var config       = require('../config');
    var handleErrors = require('../util/handleErrors');

    var LessPluginAutoPrefix = require('less-plugin-autoprefix');

    //Plugins to use
    var plugins = [new LessPluginAutoPrefix({browsers: ["last 2 versions"]})];

    if (config.isReleaseBuild) {
        var LessPluginCleanCSS = require("less-plugin-clean-css");
        plugins.push(new LessPluginCleanCSS({advanced: true}));
    }

    return gulp.src(config.less.src)
        .pipe(plumber({errorHandler:handleErrors}))

        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: plugins
        }))
        .pipe(gulpif(!config.isReleaseBuild, sourcemaps.write({sourceRoot:'http://localhost:'+config.staticServer.port+'/src/'})))

        .pipe(gulp.dest(config.dist + config.less.dir))
});