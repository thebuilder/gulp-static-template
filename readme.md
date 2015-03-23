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
All the individual tasks are located in *gulp/tasks/*. They are self contained, and can be run independent of each other.
If you are running in watch mode, the tasks will configure their own watch logic.

### Config
Base paths are all defined in *gulp/config.js*. Feel free to change these to suit your needs.

### Gulp Arguments
When calling `gulp`, you can pass it the following arguments in addition to tasks.

##### --watch
Runs the tasks supplied in watch mode. So calling `gulp less --watch` will compile you LESS files, and watch for changes.

##### --release
Runs the tasks supplied in production mode. By default tasks are run in dev mode, but you can use this argument to override it.

## Setup
### Vendor libs
A seperate 'vendor.js' file is created when compiling, that includes third party .js files. You can require these in your app, where you need them.

To add a library, you should include it in the `browser`field, inside `package.json`, like:

```
"browser": {
  "gsap": "./node_modules/gsap/src/uncompressed/TweenMax.js"
}
```

### FTP
To upload the dist directory to FTP, you should create a `.ftp.json` file in the gulp directory.

The `.ftp.json` file should have the following structure, based on the options used by vinyl-ftp: https://www.npmjs.com/package/vinyl-ftp

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