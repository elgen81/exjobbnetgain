//server.ts

import app = require("./app");
import { logController } from './logger'
import { config } from "./_config";
import { connection } from "mongoose";

const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager

var port:number = config.port || 3000;

var server = app.listen(port, function(err){
	if(err) { 
		logController(process.argv[1], err, 'error', "Listening on port")
	 }
	else{
		console.log("Express server listening on port " + port);
	}
});
const shutdownManager = new GracefulShutdownManager(server)
process.on('SIGTERM', () =>{
	shutdownManager.terminate(() => {
		logController(process.argv[1], 'Server is shutdown gracefully', "info")
	})
})

export = server