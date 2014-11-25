/**
 * Delete files from dist that are no longer used.
 * @param pattern {String} The pattern to find files in. This should be in the dist directory.
 * @param options {Object} gulp.src options. You can also set 'dist' and 'src' if they differ
 * @param callback {Function} Callback function to call after unused files have been deleted.
 * @return {*}
 */
module.exports = function(pattern, options, callback) {
	var glob       = require('glob');
	var gutil 	   = require('gulp-util');
	var del        = require('del');
	var fs         = require('fs');
	var path       = require('path');
	var config     = require('../config');

	options = options || {};
	var src = options.src || config.src;
	var dist = options.dist || config.dist;

	glob(pattern, options, function (er, files) {
		var filesToDelete = [];
		var dirsToDelete = [];

		//Find all files that exists in dist directory, but not in src directory and add to deletion array.
		files.forEach(function(file) {
			var relPath = src + path.relative(dist, file);
			if (!fs.existsSync(relPath)) {
				filesToDelete.push(file);

				//Add the directory to the dirsToDelete. It will only be deleted if it is actually empty.
				var dirName = path.dirname(file);
				if (dirsToDelete.indexOf(dirName) == -1) {
					dirsToDelete.push(dirName);
				}
			}
		});

		//Delete all files marked for removal.
		if (filesToDelete.length) {
			del(filesToDelete.concat(dirsToDelete), options, function(err) {
				if(err) {
					gutil.log("Failed to delete unused file:", err);
				}
				if (callback) callback();
			})
		} else if (callback) {
			callback();
		}
	});
};