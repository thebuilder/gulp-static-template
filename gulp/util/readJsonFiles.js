var fs = require('fs');

/**
 * Reads all the .json files in a directory, and returns an object containing it
 * @param dir
 * @returns {Object}
 */
module.exports = function(dir) {
    var data = {};
    if (!dir) return data;
    if (dir.indexOf(dir.length-1) != "/") dir += "/";

    //Retrieve all the files
    if (fs.existsSync(dir)) {
        // handle result
        var files = fs.readdirSync(dir);
        files.filter(function(file) {
            return file.substr(-5) == '.json';
        }).forEach(function(file) {
            //Read all the json files, and assign their values to a data object with their name as id.
            data[file.substr(0, file.length-5)] = JSON.parse(fs.readFileSync(dir + file, 'utf-8'));
        });
    }

    return data;
};