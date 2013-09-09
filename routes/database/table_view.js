var sqlite3 = require('sqlite3').verbose();
var db;

exports.get = function(req, res){
	console.log("Serving " + __filename);
	
	var db_name = req.params.db_resource;
	var table = req.params.table;
	
	var dbpath = 'databases/' + db_name;
	db = new sqlite3.Database(dbpath, function(err){
		if (err) res.render('database/db_edit', {message: 'Error: ' + err});	
	});
	
	db.all(" select * from " + table, function(err, rows) {
        
        var message = rows.length > 0 ? "Viewing " + db_name + '/' + table : "No data found in table '" + table + "' in " + db_name;
        
        res.render('database/table_view', {message: message, rows: rows});
        db.close();
    });
};

