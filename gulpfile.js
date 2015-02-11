var gulp = require('gulp');
var config = require("./gulp/config");


//Tasks in the project
gulp.task('browserify', require('./gulp/v4-tasks/browserify'));
gulp.task('less', require('./gulp/v4-tasks/less'));
gulp.task('images', require('./gulp/v4-tasks/images'));
gulp.task('jade', require('./gulp/v4-tasks/jade'));
gulp.task('serve', require('./gulp/v4-tasks/serve'));

//Task aliases - These tasks combines multiple tasks to accomplish what you need.
gulp.task('build', gulp.parallel('browserify', 'less', 'jade', 'images'));

gulp.task('release', gulp.series(configureProd, 'build'));
gulp.task('default', gulp.series(watch, 'build', 'serve'));

function watch(done) {
	process.env.WATCHING = 'true';
	var watch = require('gulp-watch');
	var livereload = require('gulp-livereload');

	//Configure LiveReload, and watch for changes in the dist directory.
	livereload.listen({quiet:true, start:true, basePath: 'dist'});
	watch('dist/**/*.*')
		.pipe(livereload());

	done();
}


function configureProd(done) {
	process.env.NODE_ENV = 'production';
	process.env.WATCHING = 'false';

	if (done) done();
}