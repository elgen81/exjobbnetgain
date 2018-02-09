"use strict";
//whitelist.ts
var File = require("../dist/file");
var file = new File;
function whitelist(action, adress) {
    switch (action) {
        case 'add':
            console.log("Add " + adress + " to whitelist");
            file.appendLine('whitelist', adress);
            break;
        case 'remove':
            console.log("Remove " + adress + " from whitelist");
            file.removeLine('whitelist', adress);
            break;
        case 'display':
            file.showFile('whitelist');
            break;
    }
}
module.exports = whitelist;
