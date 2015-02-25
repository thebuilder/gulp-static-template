module.exports = function(done) {
	var browserSync = require('browser-sync');
	var watch = require('gulp-watch');
	var config  = require('../config');

	//See http://www.browsersync.io/docs/options/ for all options
	var options = {
		server: {
			baseDir: "./" + config.dist
		},
		port: config.server.port,

		logLevel: 'info',
		logPrefix: "BrowserSync",
		logFileChanges: false,
		notify: true
	};

	//Start the BrowserSync server
	browserSync(options, function(err, bs) {
		//BrowserSync running
		done();
	});

	//Watch for changes and reload BrowserSync
	watch(config.dist + '**/*.*', function(file) {
		browserSync.reload(file.relative);
	})
};