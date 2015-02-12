var gulp = require('gulp');
var config = require("./gulp/config");


//Tasks in the project
gulp.task('browserify', require('./gulp/tasks/browserify'));
gulp.task('less', require('./gulp/tasks/less'));
gulp.task('images', require('./gulp/tasks/images'));
gulp.task('jade', require('./gulp/tasks/jade'));
gulp.task('serve', require('./gulp/tasks/serve'));

//Task aliases - These tasks combines multiple tasks to accomplish what you need.
gulp.task('build', gulp.series('browserify', 'less', 'jade', 'images'));

gulp.task('release', gulp.series(configureProd, 'build'));
gulp.task('default', gulp.series(watch, 'build', 'serve'));


function watch(done) {
	process.env.WATCHING = 'true';
	done();
}

function configureProd(done) {
	process.env.NODE_ENV = 'production';
	process.env.WATCHING = 'false';

	if (done) done();
}