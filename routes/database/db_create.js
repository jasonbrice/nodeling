/**
 * New node file
 */
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var db;
	
exports.get = function(req, res){
	console.log("Serving " + __filename);
	res.render('database/db_create', {title: 'new database', message: 'Enter a new database name'});
};

exports.post = function(req, res){
	console.log("Serving " + __filename);
	
	var dbpath = 'databases/' + req.body.name + '.db';
	
	console.log("Received request to create new database called " + req.body.name);
	
	 // don't forget about method chaining: new sqlite3.Database('test_create.db', next_method);
    db = new sqlite3.Database(dbpath, function(err){
    	if(err){
    		console.trace();
    		res.render('database/db_create', {title: 'new database', message: 'new database ' + req.body.name + ' WAS NOT created: ' + err});	
    	}else{
    		db.close();
    		res.render('database/db_create', {title: 'new database', message: 'new database ' + req.body.name + ' successfully created'});
    	}
    });
	    
};