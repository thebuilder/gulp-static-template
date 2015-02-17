var gulp = require('gulp');

//Start with parsing arguments.
parseArguments();


/*******************
 * GULP TASKS
 *******************/
//Tasks in the project
gulp.task('browserify', require('./gulp/tasks/browserify'));
gulp.task('less', require('./gulp/tasks/less'));
gulp.task('images', require('./gulp/tasks/images'));
gulp.task('jade', require('./gulp/tasks/jade'));
gulp.task('serve', require('./gulp/tasks/serve'));

//Task aliases - These tasks combines multiple tasks to accomplish what you need.
gulp.task('build', gulp.series('browserify', 'less', 'jade', 'images'));

//Main entry tasks
gulp.task('release', gulp.series(configureProd, 'build'));
gulp.task('default', gulp.series(watch, 'build', 'serve'));




/*******************
 * Private methods
 * These methods are used to configure the environment.
 *******************/

function watch(done) {
	process.env.WATCHING = 'true';
	if (!process.env.MONITOR_GULP) {
		//Start the Gulp Monitor process. This will stop the current gulp task flow in this process - It will be restarted in the new instance.
		require('./gulp/tasks/monitor')();
	} else {
		done();
	}
}

function configureProd(done) {
	process.env.NODE_ENV = 'production';
	process.env.WATCHING = 'false';

	if (done) done();
}

/**
 * Parse the commandline arguments passed to Gulp
 */
function parseArguments() {
	var gutil = require('gulp-util');
	var tasks = gutil.env._; //All the tasks passed to gulp
	//If watch flag passed, start watching
	process.env.WATCHING = tasks.indexOf('watch') > -1 || gutil.env['watch'] || 'false'; //Watch task, or watch flag passed

	if (process.env.WATCHING == 'true') gutil.log(gutil.colors.green("Watching"));

	//Check for release or production target flag
	if (gutil.env['release'] || gutil.env['r'] || gutil.env['target'] == 'production') {
		process.env.NODE_ENV = 'production';
		gutil.log("Target ENV: " + gutil.colors.green(process.env.NODE_ENV));
	}
}