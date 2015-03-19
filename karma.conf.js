module.exports = function (config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '',

		// frameworks to use
		frameworks: ['browserify', 'jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'src/js/**/*.spec.js',
			'dist/js/vendor.js',
			'dist/js/app.js'
		],
		preprocessors: {
			'src/js/**/*.spec.js': ['browserify'],
			'dist/js/app.js': ['sourcemap']
		},
		browserify: {
			debug: true
		},

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		// GULP: karma.js overrides this value in watch mode!
		reporters: ['progress'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_WARN,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};
