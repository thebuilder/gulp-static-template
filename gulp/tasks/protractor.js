var gulp = require('gulp');
var gutil = require('gulp-util');

var config = require('../config');

var server;

// Run e2e tests using protractor.
gulp.task('protractor', ['webdriver:update'], function() {
	var protractor = require('gulp-protractor').protractor;

	var args = null;
	var baseUrl = process.env.BASE_URL;

	if (baseUrl) {
		args = ['--baseUrl', baseUrl];
		gutil.log("Running protractor for: " + gutil.colors.magenta(baseUrl));
	}

	startServer();

	return gulp.src(config.test.e2e)
			.pipe(protractor({
				configFile: 'protractor.conf.js',
				args: args
			}))
			.on('error', onError)
			.on('end', stopServer);
});

gulp.task('protractor-standalone', ['webdriver:update'], function(done) {
	gulp.start('webdriver:start', done);

	setTimeout(function() {
		startServer();
		gutil.log('Execute this task in a new terminal tab, to start the Element Explorer: ');
		gutil.log(' > ' + gutil.colors.yellow('node node_modules/gulp-protractor/node_modules/protractor/bin/elementexplorer.js localhost:' + config.server.port));
	}, 1500);
});

function onError() {
    stopServer();
}

function startServer(){
    var connect = require('connect');
    var http    = require('http');
    var serveStatic = require('serve-static');
    var handleErrors = require('../util/handleErrors');
    var config  = require('../config');

    gutil.log("Start web server");
    var app = connect();
	app.use(serveStatic(config.server.root));
	app.use(serveStatic(config.dist));

    server = http.createServer(app);
    server.listen(config.server.port);
    server.on("error", handleErrors, false);
}

function stopServer() {
    if (server) {
        gutil.log("Close web server");
        server.close();
        server = null;
    }
}

// Update/install webdriver.
gulp.task('webdriver:update', require('gulp-protractor').webdriver_update);
// Start standalone webdriver.
gulp.task('webdriver:start', require('gulp-protractor').webdriver_standalone);