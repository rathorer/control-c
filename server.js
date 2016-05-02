var connect = require('connect');
var http = require('http');
var url = require('url');
var proxy = require('proxy-middleware');
var urlrouter = require('urlrouter');

var options = {
	pageNotFound: function(req, res) {
		res.statusCode = 404;
		res.end('er... some page miss...');
	},
	errorHandler: function(req, res) {
		res.statusCode = 500;
		res.end('oops..error occurred');
	}
};

function loadUser(req, res, next) {
	// You would fetch user from the db
	var user = users[req.params.id];
	if (user) {
		req.user = user;
		next();
	} else {
		next(new Error('Failed to load user ' + req.params.id));
	}
}
var routes = urlrouter(function(app) {
	app.get('/', function(req, res, next) {
		res.end('hello urlrouter');
	});
	app.get('/user/:id([0-9]+)', function(req, res, next) {
		res.end('hello user ' + req.params.id);
	});
	app.get('/:name([a-z]+)', function(req, res, next) {
		res.end('hello ' + req.params.name);
	});
	app.get('/', function(req, res) {
		res.end('GET home page' + req.url + ' , headers: ' + JSON.stringify(req.headers));
	});
	// with route middleware
	app.get('/user/:id', loadUser, function(req, res) {
		res.end('user: ' + req.params.id);
	});

	// GET /admin 301 redirect to /admin/
	app.redirect('/admin', '/admin/');

	app.get(/^\/users?(?:\/(\d+)(?:\.\.(\d+))?)?/, loadUser, function(req, res) {
		res.end(req.url + ' : ' + req.params);
	});

	app.get('/foo', function(req, res) {
		res.end('GET ' + req.url + ' , headers: ' + JSON.stringify(req.headers));
	});
}, options);


var application = connect(routes);

application.use('/openapi', proxy(url.parse('https://www.tradingfloor.com/openapi')));
application.use(function(req, res, next) {
	res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
	res.setHeader("Pragma", "no-cache");
	next();
});

application.use(connect.static(process.cwd()));
var server = application.listen(3000);
// var server = http.createServer(routes).listen(3000);
console.log('Listening at 3000', server);
