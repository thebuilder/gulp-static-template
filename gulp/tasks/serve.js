var gutil = require('gulp-util');
var config  = require('../config');
var handleErrors = require('../util/handleErrors');


/**
 * Setup a local webserver.
 */
module.exports = function(done) {
	var connect = require('connect');
	var http    = require('http');
	var serveStatic = require('serve-static');
	var ip = require('../util/ip');

	var app = connect();
	//Configure server to inject LiveReload script
	app.use(serveStatic('node_modules/livereload-js/dist/'));
	app.use(require('connect-livereload')({
		src: "http://" + ip() + ":35729/livereload.js?snipver=1"
	}));

	//Serve the static files.
	app.use(serveStatic(config.dist));


	// Serve the src directory, so it can be used with source maps - Doesn't seem to be necessary anymore
	//app.use('/src', serveStatic(config.src));
	//app.use('/bower_components', serveStatic('bower_components/'));

	var server = http.createServer(app);
	server.listen(config.server.port);
	server.on("error", handleErrors, false);

	gutil.log("Webserver: " + gutil.colors.magenta("http://localhost:" + config.server.port) + " or " + gutil.colors.magenta("http://" + ip() + ":" + config.server.port));

	liveReloadWatcher();
	done();
};

/*
* Watch all files in the dist directory, and trigger livereload on changes.
*/
function liveReloadWatcher() {
	var watch = require('gulp-watch');
	var liveReload = require('gulp-livereload');

	//Configure LiveReload, and watch for changes in the dist directory.
	liveReload.listen({quiet:true, start:true, basePath: 'dist'});
	gutil.log('LiveReload: ' + gutil.colors.magenta('Port ' + liveReload.server.port));
	watch(config.dist + '**/*.*')
		.pipe(liveReload());
}