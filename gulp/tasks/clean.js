/**
 * Simple task that deletes everything in the 'dist' directory. Use to ensure a clean release build.
 * @param done
 */
module.exports = function clean(done) {
	var del      = require('del');
	var config   = require('../config');

	//Delete the dist directory
	del(config.dist, done);
};
