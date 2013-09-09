var sqlite3 = require('sqlite3').verbose();
var db;

var environment = require('../../utils/environment.js');
var reflection =  require('../../utils/reflection.js');

exports.get = function(req, res){
	console.log("Serving " + __filename);
	
	var db_name = req.params.db_resource;
	var table = req.params.table;
	
	var dbpath = 'databases/' + db_name;
	db = new sqlite3.Database(dbpath, function(err){
		if (err) res.render('database/db_edit', {message: 'Error: ' + err});	
	});
	
	var columns = [];
	
	db.all(" select * from sqlite_master where type='table' and name='" + table + "' ", function(err, rows) {
        rows.forEach(function (row) {
        	
        	columns = row.sql.substring(0, row.sql.length-1).substring(1+ row.sql.indexOf('(')).split(',');
        	
        	if(environment.isDebug()){
        		console.log('row.name: ' + row.name);
        		console.log('row.sql: ' + row.sql);
        		console.log('row.properties: ' + reflection.properties(row));
        		console.log('row.columns: ' + columns);
            }
            
        });
        
        var message = rows.length > 0 ? "Editing " + db_name + '/' + table : "No table found named '" + table + "' in " + db_name;
        
        res.render('database/table_edit', {message: message, columns: columns});
        db.close();
    });
};

exports.post = function(req, res){
	
	console.log("Serving " + __filename);
	
	var db_name = req.params.db_resource;
	var table = req.params.table;
	
	var column_name = req.body.column_name;
	var column_type = req.body.column_type;
	
	if(!column_name || !column_type) throw err;
	
	console.log('adding ' + column_name + '(' + column_type + ') to ' + db_name + '/' + table);
	
	var dbpath = 'databases/' + db_name;
	
	// Now, SQLite will let you alter a table by renaming or adding a column. http://www.sqlite.org/lang_altertable.html 
	// but, we're going to do it The Hard Way for 2 reasons:
	//  1) Backwards compatibility with older versions of sqlite, and
	//  2) Forwards compatibility with our own app - if we want to rename a column or something,
	//     we can refactor this code to do it. 
	db = new sqlite3.Database(dbpath, function(err){
		
		if (err) console.log(err);
		   
		db.all(" select * from sqlite_master where type='table' and name='" + table + "' ", function(err, rows) {
			
			if (err) console.log(err);
			
	        rows.forEach(function (row) {
	        	
	        	db.serialize(function(){
		        	db.run("BEGIN TRANSACTION");
		        	
		        	var create = row.sql.substring(0, row.sql.length-1).replace(table, table +'_tmp') + ', ' + column_name + ' ' + column_type + ');';
		        	if(environment.isDebug()) console.log('Trying create: ' + create);
		        	db.run(create);
		        	
		        	var rawColumnMetaData = row.sql.substring(0, row.sql.length-1).substring(1+ row.sql.indexOf('('));
		        	var rawColumns = rawColumnMetaData.split(',');
		        	var columns = [];
		        	for(var columnNum in rawColumns){
		        		var rawColumn = rawColumns[columnNum].trim();
		        		var column = rawColumn.substring(0, rawColumn.indexOf(' '));
		        		columns.push(column);
		        	}
		        	
		        	var insert = 'INSERT INTO ' + table + '_tmp(' + columns + ') SELECT ' + columns + ' FROM ' + table + ';';
		        	if(environment.isDebug()) console.log('insert: ' + insert);
		        	db.run(insert);
		        	
		        	var drop = 'DROP TABLE ' + table + ';';
		        	if(environment.isDebug()) console.log('drop: ' + drop);
		        	db.run(drop);
		        	
		        	var rename = 'ALTER TABLE ' + table + '_tmp RENAME TO ' + table + ';';
		        	if(environment.isDebug()) console.log('rename: ' + rename);
		        	db.run(rename);
		        	
		        	db.run("COMMIT TRANSACTION");
	        	}); // end serialize
	        }); // end rows foreach
	        
	        db.close();
	        res.redirect('/database/edit/' + db_name + '/' + table);
	        
		}); // end db.all
	}); // end new db
	
	
	
	
};



