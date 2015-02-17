var gutil = require('gulp-util');
var watch = require('gulp-watch');
var spawnProcess;

/**
 * Watch the gulpfile.js and Gulp directory. If anything changes, restart the current Gulp task.
 **/
module.exports = function monitor(cb) {
	//Start by creating the child process.
	if (!process.env.MONITOR_GULP) {
		//Set env variable, so we know we are running the monitor
		process.env.MONITOR_GULP = 'true';

		gutil.log(gutil.colors.yellow("Gulp Monitor - Spawning child process"));

		//Watch the gulpfile.js and Gulp directory. If anything changes, restart the current Gulp task.
		watch(['gulpfile.js', 'package.json', 'gulp/**/*.js'], restartGulpProcess);

		//Restart to create the child process.
		restartGulpProcess();
	} else if (cb) cb(); //If Gulp task callback, trigger it
};

/**
 * Kill the current child process, and start a new one with the same parameters
 */
function restartGulpProcess(file) {
	if (file) {
		//Log out the file that changed
		var path = require('path');
		gutil.log(gutil.colors.magenta(path.basename(file.path)) + ' changed.');
	}

	var spawn = require('child_process').spawn;

	// kill previous spawned process
	if (spawnProcess) spawnProcess.kill();

	//Get the gulp tasks
	var args = args || [];
	args = args.concat(gutil.env._);

	//Find all arguments added.
	for (var key in gutil.env) {
		if (key != "_") {
			args.push('--' + key);
		}
	}

	// `spawn` a child `gulp` process linked to the parent `stdio`
	spawnProcess = spawn('gulp', args, {stdio: 'inherit'});
}