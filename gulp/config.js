module.exports = {
	//Paths
	src: 'src/',
	dist: 'dist/',

	server: {
		port: '3000'
	},

	js: {
		src: 'src/js/app.js',
		watch: 'src/js/**/*.js'
	},

	style: {
		//Supported preprocessors: 'less', 'stylus' or null
		preprocessor: 'stylus',
		src: ['src/style/*.{less,styl}', '!src/style/_*.*'],
		watch: 'src/style/**/{*.less,*.css,*.styl}'
	},

	jade: {
		src: ['src/views/**/*.jade', '!src/views/**/_*.jade'],
		watch: 'src/views/**/*.*',
		data: 'src/data/'
	},

	img: {
		src: 'src/images/**/{*.png,*.jpg,*.gif,*.svg,*.ico}',
		dir: 'images'
	},

	assets: {
		src: ['src/assets/**.*']
	},

	test: {
		files:  [
			'src/js/**/*.spec.js',
			'dist/js/vendor.js',
			'dist/js/app.js'
		]
	},

	isProduction: function() {
		return process.env.NODE_ENV == "production";
	},

	isWatching: function() {
		return process.env.WATCHING == "true";
	}
};