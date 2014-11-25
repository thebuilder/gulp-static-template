var gulp = require("gulp");
/**
 * The deploy reads FTP details from '.ftp.json', and uploads the config.dist directory.
 * If more than one build target exists, you can target a specfic one with:
 * gulp deploy --target ID
 *
 * The .ftp.json file should have the following structure, based on the options used by gulp-ftp: https://github.com/sindresorhus/gulp-ftp
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
gulp.task('ftp', ["release"], function () {
	var gutil = require('gulp-util');
	var ftp = require("gulp-ftp");
	var plumber = require("gulp-plumber");

	//Read data
	var config = require("../config");
	var ftpTargets = require('../.ftp.json');
	var argv = require('minimist')(process.argv.slice(2));


    if (!ftpTargets) {
        gutil.log(gutil.colors.red("Error:"), "No '.ftp.json' file found. Make sure it is created.");
        return null;
    }
    if (!ftpTargets.length) {
        gutil.log(gutil.colors.red("Error:"), "'.ftp.json' file is empty. Make sure it contains at least one deploy target.");
        return null;
    }

    var options;
    var target = argv.target;
    if (ftpTargets.length == 1 || !target) {
        //If only one target exists in the .json file use it.
        if (ftpTargets[0].hasOwnProperty("ftp")) options = ftpTargets[0].ftp;
        else options = ftpTargets[0];
    } else {
        //Find the build target with matching id
        for (var i = 0; i < ftpTargets.length; i++) {
            var obj = ftpTargets[i];
            if (obj.id == target) {
                gutil.log("Using deploy target:", gutil.colors.yellow(target));
                options = obj.ftp;
                break;
            }
        }
    }

    if (options) {
        gutil.log("Deploying to", gutil.colors.yellow(options.host));
        return gulp.src(config.dist + "/**/*.*")
            .pipe(plumber())
            .pipe(ftp(options));
    } else {
        gutil.log(gutil.colors.red("Error:"), "Failed to read FTP details from '.ftp.json' file. " + (target ? " Target not found: " + target : ""));
        return null;
    }
});