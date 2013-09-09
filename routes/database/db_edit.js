/**
 * New node file
 */
var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var db;

exports.get = function(req, res){
	console.log("Serving " + __filename);
		
	var resource =  req.params.db_resource; 
	
	var dbpath = 'databases/' + resource;
	
	var message = fs.existsSync(dbpath) ? "Found the following tables in " + resource : "Could not find " + resource;
		
	db = new sqlite3.Database(dbpath, function(err){
		if (err) res.render('database/db_edit', {message: 'Error: ' + err});	
	});

    db.all(" select * from sqlite_master where type='table' ", function(err, rows) {
        rows.forEach(function (row) {
            console.log('row: ' + row.name);
        });
        
        res.render('database/db_edit', {message: message, resource: resource, tables: rows});
        db.close();
    });
	
};

exports.post = function(req, res){

	var resource =  req.params.db_resource; 
	
	var dbpath = 'databases/' + resource;
	
	console.log('adding table to ' + dbpath);
	
	if(!fs.existsSync(dbpath)) throw err;
	
	var table_name = req.body.table_name;
	
	console.log('adding table name ' + table_name);

	db = new sqlite3.Database(dbpath, function(err){
		
	if (err) res.render('database/db_edit', {message: 'Error: ' + err});	
    	
    	db.serialize(function(){
        	db.run("BEGIN TRANSACTION");
        	db.run("CREATE TABLE " + table_name + "(id integer primary key asc);");
        	db.run("COMMIT TRANSACTION");
    	}); // end serialize
    
    	res.redirect('database/edit/' + resource + '/' + table_name);
        db.close();
	        
	}); // end new db
		
};