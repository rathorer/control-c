# javascript-app-seed
This is basic template to start any javascript web application, which utilizes npm and browserify to manage and run the app. 

The browserify takes care the dependency injection.

How to start:

1. Clone the seed project to you local system.
2. Open the command prompt
2. run npm install
 It will install the dev dependencies and create the node_module folder
3. run 
```npm start```
 It will start the app, if browser doesn't open automatically, visit http://localhost:9966/ 

In case you see this error:
####Error: Could not find a suitable bundler!


Just install browserify globally:
```
npm install -g browserify
```

[refer this for reasoning](https://github.com/chrisdickinson/beefy/issues/70)

Add new files to your app with new modules:
```
file: newModule.js

module.newModule = function(name){
	return 'Hello '+name+'!';
}
```
and inject this file/module as below:
```
var newModule = require('./app/newModule.js');
```
