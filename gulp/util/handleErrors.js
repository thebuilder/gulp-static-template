var notify = require("gulp-notify");
var gutil = require('gulp-util');
var config = require('../config');
var supportsNotifications = !process.env["CI"]; //Disable notifications on CI server.

module.exports = function() {
    var args = Array.prototype.slice.call(arguments) || {};

    if (supportsNotifications) {
        // Send error to notification center with gulp-notify
        notify.onError({
            title: "Error",
            message: "<%= error.message %>",
            sound: "Submarine",
            emitError: config.isReleaseBuild
        }).apply(this, args);
    } else {
        //Gulp notify not supported on Windows, so print the message instead.
        gutil.log("[" +  gutil.colors.blue("Compile Error") + "] " + gutil.colors.red.apply(this, args) )
    }

    if (typeof this.emit != "undefined") {
        this.emit('end');
    } else if (config.isReleaseBuild) {
        throw new Error(args);
    }
};
