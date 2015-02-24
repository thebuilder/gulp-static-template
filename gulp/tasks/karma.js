var gulp = require('gulp');
var path = require('path');
var ip = require('../util/ip');
var config = require('../config');

module.exports = function(done) {
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
	}

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