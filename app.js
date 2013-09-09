
/**
 * Module dependencies.
 */

// built in modules
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

// user modules
var echo = require('./routes/echo'); // simple echo service (ip address, date/time)

// environment
var environment = require('./utils/environment.js');

// database CRUD
var db_create = require('./routes/database/db_create'); // create a new database
var db_list = require('./routes/database/db_list'); // list existing databases
var db_edit = require('./routes/database/db_edit'); // view/edit a database
var table_edit = require('./routes/database/table_edit'); // view/edit a table's metadata
var table_view = require('./routes/database/table_view'); // view a table's data

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/echo', echo.list);

// database stuff
app.get('/database/create', db_create.get);
app.post('/database/create', db_create.post);
app.get('/database/list', db_list.get);
app.post('/database/list', db_list.post);
app.get('/database/edit/:db_resource', db_edit.get);
app.post('/database/edit/:db_resource', db_edit.post);
app.get('/database/edit/:db_resource/:table', table_edit.get);
app.post('/database/edit/:db_resource/:table', table_edit.post);
app.get('/database/view/:db_resource/:table', table_view.get);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + '. Debug mode: ' + environment.isDebug());
});
