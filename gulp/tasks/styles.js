var gulp         = require('gulp');
var gutil        = require('gulp-util');
var config       = require('../config');
var compileError = false;

module.exports = function() {
	//If watch mode, start watching for changes.
	if (config.isWatching()) {
		var watch = require('gulp-watch');
		watch(config.style.watch, execute);
	}

	//Execute the less task
	return execute();
};

/**
 * Run the task
 */
function execute() {
	//Inject all required files
	var rename       = require('gulp-rename');
	var sourcemaps   = require('gulp-sourcemaps');
	var autoprefixer = require('gulp-autoprefixer');
	var minifyCSS 	 = require('gulp-minify-css');
	var plumber      = require('gulp-plumber');
	var es 			 = require('event-stream');
	var handleErrors = require('../util/handleErrors');

	//Retrieve the CSS Preprocessor needed.
	var preprocessor = null;
	var preprocessorOptions = {};
	if (config.style.preprocessor == 'stylus') {
		preprocessor = require('gulp-stylus');
		preprocessorOptions = {'include css': true};
	} else if (config.style.preprocessor == 'less') {
		preprocessor = require('gulp-less');
	}


	var includeSourceMaps = !config.isProduction();

	return gulp.src(config.style.src)
		.pipe(plumber({errorHandler:function(args) {
			compileError = true;
			handleErrors(args);
		}}))
		.pipe(sourcemaps.init() )

		//Compile Stylus
		.pipe(preprocessor ? preprocessor(preprocessorOptions) : gutil.noop())

		//Write the sourcemap for the compile LESS, than start a new Sourcemaps stream that loads the current sourcemap
		.pipe(includeSourceMaps ? sourcemaps.write({includeContent: false}) : gutil.noop())
		.pipe(sourcemaps.init({loadMaps: true}))

		//Autoprefix and minify
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(config.isProduction() ? minifyCSS({
			keepBreaks:false,
			compatibility: 'ie8'
		}) : gutil.noop())

		.pipe(includeSourceMaps ? sourcemaps.write() : gutil.noop())

		.pipe(config.isProduction() ? rename(function(file) {
			file.basename += ".min";
		}) : gutil.noop())

		//Write to dist
		.pipe(gulp.dest(config.dist + 'css'))

		//Notify the user on successful compile, after an error
		.pipe(compileError ? es.map(function(file, cb) {
			if (compileError) gutil.log(gutil.colors.green("Stylesheet compiled"));
			compileError = false;
		}) : gutil.noop());
}