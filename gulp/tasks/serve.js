/**
 * Setup a local webserver.
 */
module.exports = function(done) {
	var connect = require('connect');
	var http    = require('http');
	var serveStatic = require('serve-static');
	var gutil = require('gulp-util');

	var ip = require('../util/ip');
	var config  = require('../config');
	var handleErrors = require('../util/handleErrors');

	var app = connect();
	//Configure server to inject LiveReload script
	app.use(serveStatic('node_modules/livereload-js/dist/'));
	app.use(require('connect-livereload')({
		src: "http://" + ip() + ":35729/livereload.js?snipver=1"
	}));

	//Serve the static files.
	app.use(serveStatic(config.dist));

	var server = http.createServer(app);
	server.listen(config.server.port);
	server.on("error", handleErrors, false);

	gutil.log("Webserver: " + gutil.colors.magenta("http://localhost:" + config.server.port) + " or " + gutil.colors.magenta("http://" + ip() + ":" + config.server.port));

	done();
};

