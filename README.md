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


Setting up and running the performance tests locally, is not a big task.

Prerequisite for running the performance tests locally, is having already the chart component source up and running locally (so you can test out the application on http://localhost:8080/).

To start up the performance test framework, position yourself in the Chart-library folder, ie. c:\Development\Chart or wherever you checked out and built your branch.

Fire up the webserver, with the following parameter:
.\node tools/webserver/webserver --couchdb http://9e3f0d94ec12.iriscouch.com/

Setting up and running the performance tests locally, is not a big task.

Prerequisite for running the performance tests locally, is having already the chart component source up and running locally (so you can test out the application on http://localhost:8080/).

To start up the performance test framework, position yourself in the Chart-library folder, ie. c:\Development\Chart or wherever you checked out and built your branch.

Fire up the webserver, with the following parameter:
.\node tools/webserver/webserver --couchdb http://9e3f0d94ec12.iriscouch.com/

Now, access the performance test tool through the address: http://localhost:8080/perf/

Can I access the raw, recorded data?

But of course you can.
On this address, you have access to any dataset recorded by the performance tool:
http://9e3f0d94ec12.iriscouch.com/_utils/

But, what is IrisCouch.com?

IrisCouch.com is a "free", cloudbased CouchDB provider, used for collecting and storing our performance test data.
Feel free to experiment with other solutions, such as your own IrisCouch.com db (to prevent cluttering up our "real" performance test data) or maybe even go for setting up your own CouchDB on your workstation..

I work on Cloud9 and it fails connecting to IrisCouch - what can I do?

Cloud9 already has CouchDb installed on every workspace. Follow the directions below (from Cloud9) to enable CouchDb:
sudo mkdir -p /var/run/couchdb
sudo chown couchdb:couchdb /var/run/couchdb 
sudo su couchdb -c /usr/bin/couchdb

Next, you need to create the 'perf' database:
curl -X PUT http://127.0.0.1:5984/perf

Now, create a file in the root of your project, call it view.json. Paste the view-source code from 'Can I run CouchDb locally?' into this file. Next, create the view:
curl -X PUT http://127.0.0.1:5984/perf/_design/resultViewer --data-binary @view.json


Go into the newly created 'perf' database, and create a new Document (you can find the option in the top of the screen). When creating the new document, go to "Source" edit mode (right side of the screen) and paste in the following snippet.
```
{
    "_id": "_design/resultViewer",
    "language": "javascript",
    "views": {
        "all": {
            "map": "function(doc) {\n if (doc._id.slice(0, 1) !== '_') {\n emit(new Date(doc.metadata.date).getTime(), doc.metadata);\n }\n}"
        },
        "refs": {
            "map": "function(doc) {\n if (doc._id.slice(0, 1) !== '_') {\n emit(doc.metadata.git.ref, [new Date(doc.metadata.date).getTime(), 1]);\n }\n}",
            "reduce": "function(keys, values) {\n var dates = [];\n var sums = [];\n values.forEach(function(value) {\n dates.push(value[0]);\n sums.push(value[1]);\n });\n dates.sort(function(a,b) {\n return b - a;\n });\n return [dates[0], sum(sums)];\n}"
        },
        "commits": {
            "map": "function(doc) {\n if (doc._id.slice(0, 1) !== '_') {\n emit([doc.metadata.git.ref, doc.metadata.git.hash], [new Date(doc.metadata.date).getTime(), 1, doc.metadata]);\n }\n}",
            "reduce": "function(keys, values) {\n var dates = [];\n var sums = [];\n values.forEach(function(value) {\n dates.push(value[0]);\n sums.push(value[1]);\n });\n dates.sort(function(a,b) {\n return a - b;\n });\n return [dates[0], sum(sums)];\n}"
        }
    }
}
```
Now you are ready to fire up the webserver, using _--couchdb http://localhost:{portnumber}_ as backend database.
