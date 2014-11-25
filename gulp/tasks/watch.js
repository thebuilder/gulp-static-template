var gulp = require('gulp');

gulp.task('watch', function () {
    var watch = require('gulp-watch');
	var config = require('../config');

	//JADE
	watch(config.jade.src, {name: 'JADE', read: false}, function (files, cb) {
		gulp.start('jade', cb);
	});

	//LESS
	watch(config.less.src, {name: 'LESS', read: false}, function (files, cb) {
		gulp.start('less', cb);
	});

	//Images
	watch(config.img.src, {name: 'Images', read: false}, function (files, cb) {
		gulp.start('images', cb);
	});
});