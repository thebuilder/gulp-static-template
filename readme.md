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

##### --monitor
Starts gulp in self monitoring mode. It will restart itself if you change the *gulpfile.js*, *package.json* or any files located in the *gulp* directory.