
/*
 * GET home page.
 */
var time = require('../utils/date_time');

exports.list = function(req, res){
	res.render('echo', {title: 'Echo service', time: time.now(), ip: req.connection.remoteAddress});
};

