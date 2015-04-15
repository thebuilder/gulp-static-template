/**
 * Starts a BrowserSync web server, that serves the dist directory of the project.
 * It will watch for changes, and reload the css or page on all connected devices.
 *
 * Scroll and pages are synced across all browsers/devices.
 * For more information, see: http://www.browsersync.io
 */
module.exports = function(done) {
	var browserSync = require('browser-sync');
	var handleErrors = require('../util/handleErrors');
	var config  = require('../config');

	//See http://www.browsersync.io/docs/options/ for all options
	//By default it runs a server. You could instead tell it to setup a proxy to an existing server, like - proxy: 'localhost.dev'.
	var options = {
		server: {
			baseDir: config.dist
		},
		//proxy: 'localhost:8080',
		port: config.server.port,

		//Files to watch for changes
		files: [config.dist + "**/*.*"],
		reloadDebounce: 100,

		logLevel: 'info',
		logPrefix: "BrowserSync",
		logFileChanges: false,
		notify: false,
		open: false
	};

	//Start the BrowserSync server
	browserSync(options, function(err, bs) {
		if (err) handleErrors(err);
		//BrowserSync running
		done();
	});

	//Watch for changes and reload BrowserSync
	//var watch = require('gulp-watch');
	//var log = require('../util/log-file');
	//watch([config.dist + '**/*.*'])
	//	.pipe(log("Changed"))
	//	.pipe(browserSync.reload({stream:true}));
};