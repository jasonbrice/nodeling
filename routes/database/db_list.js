/**
 * New node file
 */
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db;

//var path = require('path');


exports.get = function(req, res){
	
	console.log("Serving " + __filename);

	fs.readdir( "./databases", function( err, files) {
        if ( err ) {
            console.log("Error reading files: ", err);
            res.render('database/db_list', {title: 'Oops - there was an error: ' + err});
        } else {
        	res.render('database/db_list', {title: 'Found the following databases:', databases: files});       
        }
    });
	
};

exports.post = function(req, res){
	console.log("Serving " + __filename);
	
	var dbpath = 'databases/' + req.body.name + '.db';
	
	console.log("Received request to create new database called " + req.body.name);
	
	 // don't forget about method chaining: new sqlite3.Database('test_create.db', next_method);
    db = new sqlite3.Database(dbpath, function(err){
    	if(err){
    		console.trace();
    		res.render('database/db_create', {title: 'new database', message: 'New database ' + req.body.name + ' WAS NOT created: ' + err});	
    	}else{
    		db.close();
    		res.render('database/db_create', {title: 'new database', message: 'New database ' + req.body.name + ' was successfully created'});
    	}
    });
	    
};