/**
 * IDE Test runner: https://github.com/wallabyjs/public
 **/

var config = require('./gulp/config');
var wallabify = require('wallabify');

var wallabyPostprocessor = wallabify({
		// browserify options
		extensions: [".js"],
		fullPaths: false
	}, function(browserify) {
		//The browserify instance, add transforms if needed.
		//browserify.transform(require('partialify'));
		//browserify.transform(require('browserify-plain-jade'));
	}
);

module.exports = function () {
	return {
		// set `load: false` to all of the browserified source files and tests,
		// as they should not be loaded in browser,
		// their browserified versions will be loaded instead
		files: [
			// Make sure to add any files required here, like compiled Jade or HTML files.
			{pattern: config.src + '**/*.spec.js', ignore: true},
			{pattern: config.src + '**/*.js', load: false}
		],

		tests: [
			{pattern: config.src + '**/*.spec.js', load: false}
		],

		postprocessor: wallabyPostprocessor,

		bootstrap: function () {
			// required to trigger tests loading
			window.__moduleBundler.loadTests();
		}
	};
};