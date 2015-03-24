var gutil = require('gulp-util');

/**
 * Parse the commandline arguments passed to Gulp
 */
exports.parse = function() {
	var tasks = gutil.env._; //All the tasks passed to gulp
	//If watch flag passed, start watching
	process.env.WATCHING = tasks.indexOf('watch') > -1 || gutil.env['watch'] || 'false'; //Watch task, or watch flag passed

	if (process.env.WATCHING == 'true') gutil.log(gutil.colors.green("Watching"));

	//Check for release or production target flag
	if (gutil.env['release'] || gutil.env['production'] || gutil.env['r'] || gutil.env['target'] == 'production') {
		process.env.NODE_ENV = 'production';
		gutil.log("Target ENV: " + gutil.colors.green(process.env.NODE_ENV));
	}

	//Check for monitor
	process.env.MONITOR_GULP = gutil.env["monitor"] ? 'true' : 'false';
};

/**
 * Configure the env to run in watch mode. Also check for MONITOR, and start monitoring.
 * @returns {boolean}
 */
exports.watch = function() {
	if (process.env.MONITOR_GULP == 'true') {
		//Start the Gulp Monitor process. This will stop the current gulp task flow in this process - It will be restarted in the new instance.
		require('./util/monitor')();
		return false;
	} else {
		process.env.WATCHING = 'true';
	}
	return true;
};

/**
 * Configure the env for production
 * @returns {boolean}
 */
exports.production = function() {
	process.env.NODE_ENV = 'production';
	process.env.WATCHING = 'false';

	return true;
};