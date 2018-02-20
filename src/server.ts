//server.ts

import app = require("./app");
var port:number = 3000;

var server = app.listen(port, function(err){
	if(err) { throw err }
	else{
		console.log("Express server listening on port " + port);
	}
});