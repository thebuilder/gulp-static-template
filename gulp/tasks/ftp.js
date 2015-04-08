var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var path = require( 'path' );
var config = require('../config');

/**
 * The deploy reads FTP details from '.ftp.json', and uploads the config.dist directory.
 * If more than one build target exists, you can target a specfic one with:
 * gulp deploy --target ID
 *
 * The .ftp.json file should have the following structure, based on the options used by vinyl-ftp: https://www.npmjs.com/package/vinyl-ftp
 [{
    "id": "demo",
    "ftp": {
        "host": "",
        "port": 21,
        "user": "",
        "pass": "",
        "remotePath": ""
    }
 }]
 **/
module.exports = function() {
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		watch(config.img.src, deploy);
	}
	deploy();
};

function deploy() {
	var ftp = require( 'vinyl-ftp' );
	var es = require('event-stream');

	var options = getTarget();
	if (!options) return null;

	var conn = ftp.create(options);

	// using base = '.' will transfer everything to dist correctly
	return gulp.src("**/*.*", { base: config.dist, cwd: config.dist, buffer: false } )
		.pipe(conn.newer(options.remotePath)) // only upload newer files
		.pipe(es.map(logFiles))
		.pipe(conn.dest(options.remotePath));
}

/**
 * Reads the .ftp.json file, and fetches the FTP options from it.
 * @returns {*}
 */
function getTarget() {
	var fs = require( 'fs' );

	//Check if the FTP props file exists.
	if (!fs.existsSync('.ftp.json')) {
		gutil.log(gutil.colors.red("Error:"), "No '.ftp.json' file found. Make sure it is created.");
		return null;
	}

	var ftpTargets = JSON.parse(fs.readFileSync('.ftp.json', 'utf-8'));
	if (!ftpTargets.length) {
		gutil.log(gutil.colors.red("Error:"), "'.ftp.json' file is empty. Make sure it contains at least one deploy target.");
		return null;
	}

	var target = gutil.env['target'];
	var options;
	if (ftpTargets.length == 1 || !target) {
		//If only one target exists in the .json file use it.
		if (ftpTargets[0].hasOwnProperty("options")) options = ftpTargets[0].options;
		else options = ftpTargets[0];
	} else {
		//Find the build target with matching id
		for (var i = 0; i < ftpTargets.length; i++) {
			var obj = ftpTargets[i];
			if (obj.id == target) {
				gutil.log("Using deploy target:", gutil.colors.yellow(target));
				options = obj.options;
				break;
			}
		}
	}

	if (!options) gutil.log(gutil.colors.red("Error:"), "Failed to read FTP details from '.ftp.json' file. " + (target ? " Target not found: " + target : ""));
	return options
}

function logFiles(file, cb) {
	gutil.log("Upload: " + gutil.colors.magenta(path.relative(config.dist, file.path)));
	cb(null, file);
}