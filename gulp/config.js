//Root directories for the src and dist directory.
var root = {
	src: 'src/',
	dist: 'dist/'
};

module.exports = {
	//Paths
	src: root.src,
	dist: root.dist,

	server: {
		port: '3000'
	},

	js: {
		src: root.src + 'js/app.js'
	},

	style: {
		//Supported preprocessors: 'less', 'stylus' or null
		preprocessor: 'stylus',
		src: root.src + 'style/!(_)*.{less,styl}',
		watch: root.src + 'style/**/{*.less,*.css,*.styl}'
	},

	jade: {
		base: root.src + 'views/',
		src: root.src + 'views/**/!(_)*.jade',
		watch: root.src + 'views/**/*.*',
		data: root.src + 'data/'
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
	}
};