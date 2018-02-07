"use strict";
exports.__esModule = true;
//menu.ts        
var whitelist = require("./whitelist");
switch (process.argv[2]) {
    case 'output':
        if (process.argv.length > 3) {
            whitelist("add", process.argv[3]);
        }
        else {
            console.log("please provide an adress for the output");
        }
        break;
    case 'dispwhite':
        whitelist("display", '');
        break;
    case 'remove':
        if (process.argv.length > 3) {
            whitelist("remove", process.argv[3]);
        }
        else {
            console.log("please provide an adress for the output to be removed");
        }
        break;
    case 'display':
        console.log("Display the current active queues");
        break;
    case 'history':
        console.log("Display the queue history");
        break;
    case 'errorlog':
        console.log("Displaying errorlog");
        break;
    case 'restart':
        console.log("Restarting service");
        break;
    case 'shutdown':
        console.log("Saving queues and turning of system");
        break;
    default:
        console.log("Usage: node menu.js [options] [arguments]");
        console.log("");
        console.log("Options:");
        console.log("    output [host:port]       For whitelisting outputs (ex. output 192.168.0.1:8000)");
        console.log("    remove [host:port]       Remove output from whitelist (ex. remove 192.168.1:8000)");
        console.log("    dispwhite                Displays the whitelist");
        console.log("    display                  Active queues");
        console.log("    history                  Display all history");
        console.log("    errorlog                 Displays the errorlog");
        console.log("    restart                  Restarts system");
        console.log("    shutdown                 Save all data and turn off system");
}
