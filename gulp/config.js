//Root directories for the src and dist directory.
var root = {
	src: 'src/',
	dist: 'dist/'
};

module.exports = {
	//Paths
	src: root.src,
	dist: root.dist,

	//Log out changed files.
	logChanges: true,

	server: {
		port: '3000'
	},

	js: {
		//Either a string to a file path, or an array of file paths.
		src: root.src + 'js/app.js',
		excludedModules: ['normalize.css', 'bootstrap', 'angular-mocks'] //These node modules will not be included in the vendor file, even if they are present in the package.json dependencies field.
	},

	style: {
		//Supported preprocessors: 'less', 'stylus' or null
		preprocessor: 'stylus',
		src: root.src + 'style/!(_)*.{less,styl}', //Compile all style files not starting with "_" in the root style directory.
		watch: root.src + 'style/**/{*.less,*.css,*.styl}'
	},

	jade: {
		base: root.src + 'views/',
		src: root.src + 'views/**/!(_)*.jade',
		watch: root.src + 'views/**/*.{json,html,jade}',
		//Directory containing static .json data.
		data: root.src + 'views/data/'
	},

	img: {
		src: root.src + 'images/**/{*.png,*.jpg,*.gif,*.svg,*.ico}',
		dir: 'images'
	},

	assets: {
		src: [root.src + 'assets/**.*']
	},

	test: {
		files:  [
			root.src + 'js/**/*.spec.js',
			root.dist + '/js/vendor.js',
			root.dist + '/js/app.js'
		]
	},

	isProduction: function() {
		return process.env.NODE_ENV == "production";
	},

	isWatching: function() {
		return process.env.WATCHING == "true";
	},

	//BrowserSync instance is stored here.
	browserSync: null
};