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

	less: {
		src: ['src/less/*.less', '!src/less/_*.less'],
		watch: 'src/less/**/{*.less,*.css}'
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

	isProduction: function() {
		return process.env.NODE_ENV == "production";
	},

	isWatching: function() {
		return process.env.WATCHING == "true";
	}
};