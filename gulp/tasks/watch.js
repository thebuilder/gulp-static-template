var gulp = require('gulp');

gulp.task('watch', function () {
	var watch = require('gulp-watch');
	var config = require('../config');

	var livereload = require('gulp-livereload');
	livereload.listen({silent:true});

	//JADE
	watch(config.jade.watch, {name: 'JADE', read: false}, function (file) {
		gulp.start('jade', livereload.changed);
	});

	//LESS
	watch(config.less.watch, {name: 'LESS', read: false}, function (file) {
		gulp.start('less');
	});

	//Images
	watch(config.img.watch, {name: 'Images', read: false}, function (file) {
		gulp.start('images');
	});

	//When files in the dist directory are changed, pipe it to LiveReload
	watch([config.dist + '**/*.*', "!" + config.dist + "/**/*.html"], {name: 'LiveReload', silent: true})
		.on("error", function (e) {})
		.pipe(livereload());

});