var gulp = require('gulp');
var watch = require('gulp-watch');
var config = require("./gulp/config");

//Tasks in the project
gulp.task('less', require('./gulp/v4-tasks/less'));
gulp.task('jade', require('./gulp/v4-tasks/jade'));
gulp.task('serve', require('./gulp/v4-tasks/serve'));

//Watch the following tasks
gulp.task('watch', function() {
	watch('src/views/**/*.*', require('./gulp/v4-tasks/jade'));
	watch('src/less/*.less', require('./gulp/v4-tasks/less'));
});

//Task aliases - These tasks combines multiple tasks to accomplish what you need.
gulp.task('build', gulp.parallel('less', 'jade'));
gulp.task('develop', gulp.parallel('watch', 'serve'));

gulp.task('release', gulp.series(configureProduction, 'build'));
gulp.task('default', gulp.series('build', 'develop'));


function configureProduction(done) {
	process.env.NODE_ENV = 'production';
	process.env.IS_PRODUCTION = true;
	if (done) done();
}