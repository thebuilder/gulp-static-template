var gulp = require('gulp');
var sequence = require('run-sequence');
var requireDir = require('require-dir');
var config = require("./gulp/config");

// Require all tasks in gulp/tasks, including subfolders
requireDir('./tasks', { recurse: true });
