var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
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
		process.exit(exitCode);
	});

	done();
};