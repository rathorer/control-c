function init() {
	var address = require('./app/address.js');
	//var db = new PouchDB('http://localhost:5984/test');
	var db = $.couch.db("http://localhost:5984/test");
	$.couch.urlPrefix = "http://localhost:5984";
	var save = $('#saveButton');
	var pasteInput = $("#pastedText");
	//var PouchDB = require('pouchdb');
	var doc = null;
	$.couch.db("test").openDoc("mydoc", {
		success: function(data) {
			console.log('opening the doc...', data);
			doc = data;
		},
		error: function(status) {
			console.log(status);
		}
	});

	save.click(function() {
		if (doc && doc.items) {
			doc.items.push({
				modifiedAt: Date.now(),
				text: pasteInput.val()
			});
		}
		console.log('Saving the doc..', doc);
		$.couch.db("test").saveDoc(doc, {
			success: function(data) {
				console.log(data);
			},
			error: function(status) {
				console.log(status);
			}
		});
		// db.put({
		//   _id: 'mydoc',
		//   title: 'Heroes'
		// }).then(function (response) {
		//   console.log(response);
		// }).catch(function (err) {
		//   console.log(err);
		// });
	});
}
$(document).ready(function() {
	init();
	
});