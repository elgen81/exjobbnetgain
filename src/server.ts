//server.ts

import app = require("./app");
import {logController} from './logger'
var port:number = 3000;

var server = app.listen(port, function(err){
	if(err) { 
		logController(process.argv[1], err, 'error', "Listening on port")
	 }
	else{
		console.log("Express server listening on port " + port);
	}
});