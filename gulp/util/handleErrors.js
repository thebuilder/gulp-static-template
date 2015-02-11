var notify = require("gulp-notify");

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
            emitError: process.env.WATCHING
        }).apply(this, args);
    } else {
        //Gulp notify not supported on Windows, so print the message instead.
        console.log("[Compile Error] " + args )
    }

    if (typeof this.emit != "undefined") {
        this.emit('end');
    } else if (process.env.WATCHING) {
        throw new Error(args);
    }
};
