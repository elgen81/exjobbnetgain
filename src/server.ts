//server.ts

import app = require("./app");
var port:number = 3000;

var server = app.listen(port, function(){
	console.log("Express server listening on port " + port);
});