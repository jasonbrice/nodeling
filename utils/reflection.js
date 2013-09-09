module.exports.properties = function(someObj){
	var props = [];
	
	for(var prop in someObj) {
       if(someObj.hasOwnProperty(prop) && typeof someObj[prop] !== 'function') {
           	console.log(prop + ' ' + typeof someObj[prop] );
           	props.push(prop);
       }
    }
	
	return props;
}