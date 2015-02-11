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

    //Serve index page
    app.use(serveIndex(config.dist));

    // Serve the src directory, so it can be used with source maps:
    app.use('/src', serveStatic(config.src));
    app.use('/bower_components', serveStatic('bower_components/'));

    var server = http.createServer(app);
    server.listen(config.server.port);
    server.on("error", handleErrors, false);
    
    gutil.log("Webserver: " + gutil.colors.magenta("http://localhost:" + config.server.port) + " or " + gutil.colors.magenta("http://" + ip() + ":" + config.server.port));
});
