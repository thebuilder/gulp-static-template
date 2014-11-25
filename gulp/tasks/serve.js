var gulp = require("gulp");

gulp.task('serve',  function(){
    var gutil = require('gulp-util');
    var connect = require('connect');
    var http    = require('http');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');

    var config  = require('../config');
    var handleErrors = require('../util/handleErrors');
    var ip = require('../util/ip');

    var app = connect();

	//Serve the static files.
    app.use(serveStatic(config.dist));
    app.use(serveIndex(config.dist));
    app.use('/' + config.src, serveStatic(config.src)); //Serve the src directory, so it can be used with source maps

    var server = http.createServer(app);
    server.listen(config.server.port);
    server.on("error", handleErrors, false);
    
    gutil.log("Webserver: " + gutil.colors.magenta("http://localhost:" + config.server.port) + " or " + gutil.colors.magenta("http://" + ip() + ":" + config.server.port));
});
