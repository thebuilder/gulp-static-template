var gulp = require('gulp');
var sequence = require('run-sequence');
var args = require('./gulp/args');

//Start with parsing arguments.
args.parse();

/*******************
 * GULP TASKS
 *******************/
//Tasks in the project
gulp.task('assets', require('./gulp/tasks/assets'));
gulp.task('browserify', require('./gulp/tasks/browserify'));
gulp.task('browsersync', require('./gulp/tasks/browsersync'));
gulp.task('images', require('./gulp/tasks/images'));
gulp.task('jade', require('./gulp/tasks/jade'));
gulp.task('less', require('./gulp/tasks/less'));
gulp.task('karma', require('./gulp/tasks/karma'));
gulp.task('vendor', require('./gulp/tasks/vendor'));
gulp.task('ftp', require('./gulp/tasks/ftp'));

//Task aliases - These tasks combines multiple tasks to accomplish what you need.
gulp.task('build', function(done) {
	sequence('vendor', 'browserify', 'less', 'jade', 'images', 'assets', done);
});

//Main entry tasks
gulp.task('dev', function(done) {
	var watching = args.watch(); //Will return true if watch mode configured. Will be false if running a monitor task.
	if (watching) {
		sequence('build', 'karma', 'browsersync', done);
	}
});

gulp.task('release', function(done) {
	args.production();
	sequence('build', 'karma', done)
});

gulp.task('deploy', function(done) {
	args.production();
	sequence('release', 'ftp', done)
});

gulp.task('default', ['dev']);