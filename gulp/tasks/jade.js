var gulp         = require('gulp');

var json         = require("../util/readJsonFiles");
var config       = require('../config');

gulp.task('jade', function() {
    //Require in task, to improve startup time
    var data         = require('gulp-data');
    var jade         = require('gulp-jade');
    var gulpif       = require('gulp-if');
    var plumber      = require('gulp-plumber');
    var changed 	 = require('gulp-changed');
    var reload       = require('gulp-inject-reload');

    var ip = require('../util/ip');
    var handleErrors = require('../util/handleErrors');

    return gulp.src(config.jade.src)
        .pipe(plumber({errorHandler:handleErrors}))

        .pipe(data(getData))
        .pipe(jade({pretty: false}))

        //Include LiveReload script tag if creating a debug build.
        .pipe(gulpif(!config.isReleaseBuild, reload({
                host: 'http://' + ip() //Uses the local ip address of this machine, allowing you to use LiveReload on other devices connected to the network. Niceness!
            }
        )))

        .pipe(changed(config.dist, {hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest(config.dist));
});

function getData(file) {
    //Read .json data from the jadeData directory, and make it accessible to Jade.
    return json.getObject(config.jade.data)
}