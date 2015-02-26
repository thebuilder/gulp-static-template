/*
 * Watch all files in the dist directory, and trigger livereload on changes.
 */
module.exports = function(done) {
	var watch = require('gulp-watch');
	var liveReload = require('gulp-livereload');
	var config  = require('../config');

	//Configure LiveReload, and watch for changes in the dist directory.
	liveReload.listen({quiet:true, start:true, basePath: 'dist'});
	watch(config.dist + '**/*.*')
		.pipe(liveReload());

	done();
};