var gulp = require('gulp');
var path = require('path');
var ip = require('../util/ip');
var config = require('../config');

module.exports = function(done) {
	var _ = require('lodash');
	var karma = require('karma').server;

	var opts = {
		configFile: path.resolve('karma.conf.js'),
		singleRun: !config.isWatching(),
		autoWatch: config.isWatching(),
		hostname: ip()
	};

	//Test more browsers in release build.
	if (config.isProduction()) {
		opts.browsers = ["Chrome", "Firefox", "PhantomJS"];
		opts.files = [];

		//Replace app.js and vendor.js with minified versions.
		_.forEach(config.test.files, function(file, index) {
			if (file.indexOf('js/app.js') > -1) {
				file = file.replace('app.js', 'app.min.js')
			} else if (file.indexOf('js/vendor.js') > -1) {
				file = file.replace('vendor.js', 'vendor.min.js')
			}
			opts.files[index] = file;
		});
	}

	//Add the clear-screen reporter when watching.
	//if (opts.autoWatch) {
	//	opts.reporters = ['progress', 'clear-screen'];
	//}

	karma.start(opts, function (exitCode) {
		if (opts.autoWatch || exitCode) {
			process.exit(exitCode);
		} else {
			//Notify gulp that the task is complete
			done();
		}
	});

	//If watching, complete the task now.
	if (opts.autoWatch) {
		done();
	}
};