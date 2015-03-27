![image](https://codeship.com/projects/2c9eec40-b6b7-0132-2991-5a80fed4d730/status?branch=master)

Gulp Tasks Repository
=====================
This is a repository containing various Gulp tasks, that can be used in your projects.
They are all split in separate files, to make it easy to copy what you need.

Currently Work in Progress

## Getting started
The following tools are required when developing the project locally:

### Prerequisites
* [Node.js](http://nodejs.org/ "Node")
  Make sure node is installed and paths are configured, so you can use **npm** from the terminal.

After the required tools are installed, you should download the required Node modules by calling:

```
$ npm install
```

## Gulp
### Tasks
All the individual tasks are located in `./gulp/tasks/`. They are self contained, and can be run independent of each other.
If you are running in watch mode, the tasks will configure their own watch logic.

### Config
Base paths are all defined in `./gulp/config.js/. Feel free to change these to suit your needs.

### Gulp Arguments
When calling `gulp`, you can pass it the following arguments in addition to tasks.

##### --watch
Runs the tasks supplied in watch mode. So calling `gulp less --watch` will compile you LESS files, and watch for changes.

##### --release
Runs the tasks supplied in production mode. By default tasks are run in dev mode, but you can use this argument to override it.

### FTP
To enable FTP so you can upload the **dist** directory, you should create a `.ftp.json` file in the gulp directory.

The `.ftp.json` file should have the following structure, based on the options used by [https://www.npmjs.com/package/vinyl-ftp](vinly-ftp):

```
[{
  "id": "demo",
  "options": {
    "host": "",
    "port": 21,
    "user": "",
    "pass": "",
    "remotePath": "/"
  }
}]
```

## Browserify
The `app.js` file is compiled using Browserify. This allows you to **require()** files you need, and ensures everything is encapsulated.

A seperate `vendor.js` file is created when compiling. It includes .js libs, that should not be part of your main app.js. You can require these in your app, where you need them.

You control the libraries included through `package.json`.

###dependencies
All **node_modules** that should be included in the project, should be listed as dependencies. When compiling the project with Browserify, all these modules will be included in `vendor.js` and excluded from `app.js`.

### browser
If a **node_module** should use a special `.js` file, are you need to add your own files, you should add them in the `browser` field. This will override the default .js file associated with a module. 

```
"browser": {
  "gsap": "./node_modules/gsap/src/uncompressed/TweenMax.js",
  "./shared": "./src/js/shared.js"
}
```


