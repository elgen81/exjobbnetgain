//server.ts

import * as app from "./app";
var port:number = 3000;

var server = app.listen(port, function(){
	console.log("Express server listening on port " + port);
});