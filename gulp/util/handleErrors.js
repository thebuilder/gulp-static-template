var notify = require("gulp-notify");

var config = require('../config');
var supportsNotifications = true;//!process.env["CI"]; //Disable notifications on CI server.

module.exports = function() {
    var args = Array.prototype.slice.call(arguments) || {};
    console.log(args);
    if (supportsNotifications) {
        // Send error to notification center with gulp-notify
        notify.onError({
            title: "Error",
            message: "<%= typeof(error.annotated)!== 'undefined' ?  error.annotated : error.message %>",
            sound: "Submarine",
            emitError: false
        }).apply(this, args);
    } else {
        //Gulp notify not supported on Windows, so print the message instead.
		console.log("[Compile Error] " + args);
    }

    if (!config.isWatching()) {
        process.exit(1);
    } else {
		if (typeof this.emit != "undefined") {
			this.emit('end');
		} else {
        	//throw new Error(args);
		}
	}
};
