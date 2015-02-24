var gulp = require('gulp');
var sequence = require('run-sequence');
var args = require('./gulp/args');

//Start with parsing arguments.
args.parse();

/*******************
 * GULP TASKS
 *******************/
//Tasks in the project
gulp.task('browserify', require('./gulp/tasks/browserify'));
gulp.task('images', require('./gulp/tasks/images'));
gulp.task('jade', require('./gulp/tasks/jade'));
gulp.task('less', require('./gulp/tasks/less'));
gulp.task('livereload', require('./gulp/tasks/livereload'));
gulp.task('serve', require('./gulp/tasks/serve'));
gulp.task('karma', require('./gulp/tasks/karma'));

//Task aliases - These tasks combines multiple tasks to accomplish what you need.
gulp.task('build', function(done) {
	sequence('browserify', 'less', 'jade', 'images', done);
});

//Main entry tasks
gulp.task('dev', function(done) {
	var watching = args.watch(); //Will return true if watch mode configured. Will be false if running a monitor task.
	if (watching) {
		sequence('build', 'karma', 'serve', 'livereload', done);
	}
});

gulp.task('release', function(done) {
	args.production();
	sequence('build', done)
});

gulp.task('default', ['dev']);