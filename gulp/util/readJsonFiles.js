var fs = require('fs');
var path = require('path');
var read = require('fs-readdir-recursive');
var varname = require('varname');

/**
 * Reads all the .json files in a directory, and returns an array containing it.
 * @param dir {string} String directory to look up. Does not support globbing.
 * @param flatten {boolean} (false) If true each file will be added into a flat array. If false, an object with the name, path and data.
 * @returns {Object}
 */
exports.getArray = function(dir, flatten) {
    var data = [];
    dir = getDirectory(dir);
    //Retrieve all the files
    if (fs.existsSync(dir)) {
        //Find all files in the directory
        var files = read(dir);

        //Filter out and parse all .json files
        files.filter(function(file) {
            return path.extname(file) == '.json';
        }).forEach(function(file) {
            //Read all the json files, and assign their values to a data object with their name as id.
            if (!flatten) {
                data.push({
                    name: varname.camelback(path.basename(file, '.json')),
                    path: path.dirname(file) + path.sep,
                    data: readJson(dir + file)
                });
            } else {
                data.push(readJson(dir + file));
            }
        });
    }

    return data;
};

/**
 * Reads all the json files in a directory, including subdirectories, and merges the data into and object with path and filename converted into object names.
 * @param dir {string} String directory to look up. Does not support globbing.
 * @return {{}} Returns a new object.
 */
exports.getObject = function(dir) {
    var data = {};
    dir = getDirectory(dir);
    //Retrieve all the files
    if (fs.existsSync(dir)) {
        //Find all files in the directory
        var files = read(dir);

        //Filter out and parse all .json files
        files.filter(function(file) {
            return path.extname(file) == '.json';
        }).forEach(function(file) {
            //Read all the json files, and assign their values to a data object with their name as id.
            var currentObject = data;
            var dirName = path.dirname(file);
            var baseName = varname.camelback(path.basename(file, '.json'));

            //If .json is located in a subdirectory, create object from the dir names.
            if (dirName != ".") {
                currentObject = data;
                var parts = dirName.split(path.sep);
                var partName;
                for (var i = 0; i < parts.length; i++) {
                    partName = varname.camelback(parts[i]); //Convert to valid camel back name.
                    if (!currentObject[partName]) currentObject[partName] = {};
                    currentObject = currentObject[partName];
                }
            }

            //Parse the JSON
            currentObject[baseName] = readJson(dir + file);
        });
    }

    return data;
};


function getDirectory(dir) {
    if (!dir) return null;
    if (dir.indexOf(dir.length-1) != "/") dir += "/";
    return dir;
}

function readJson(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}