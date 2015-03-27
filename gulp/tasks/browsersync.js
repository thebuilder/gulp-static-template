/**
 * Starts a BrowserSync web server, that serves the dist directory of the project.
 * It will watch for changes, and reload the css or page on all connected devices.
 *
 * Scroll and pages are synced across all browsers/devices.
 * For more information, see: http://www.browsersync.io
 */
module.exports = function(done) {
	var browserSync = require('browser-sync');
	var watch = require('gulp-watch');

	var handleErrors = require('../util/handleErrors');
	var config  = require('../config');

	//See http://www.browsersync.io/docs/options/ for all options
	//By default it runs a server. You could instead tell it to setup a proxy to an existing server, like - proxy: 'localhost.dev'.
	var options = {
		server: {
			baseDir: "./" + config.dist
		},
		//proxy: 'localhost:8080',
		port: config.server.port,

		logLevel: 'info',
		logPrefix: "BrowserSync",
		logFileChanges: false,
		notify: false,
		open: process.env.MONITOR_GULP != 'true'
	};

	//Start the BrowserSync server
	browserSync(options, function(err, bs) {
		if (err) handleErrors(err);
		//BrowserSync running
		done();
	});


	//Watch for changes and reload BrowserSync
	watch(config.dist + '**/*.*')
		.pipe(browserSync.reload({stream:true}));
};