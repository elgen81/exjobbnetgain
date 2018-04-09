"use strict";
exports.__esModule = true;
var logger = require("./../dist/logger");
var fs = require('fs');
var filename= "whitelist.ini"

function openWhitelist() {
    document.getElementById("rightPage").innerHTML = '<object type="text/html" data="whitelist.html"></object>';
}
exports.openWhitelist = openWhitelist;

function createFile(filename) {
    var err = fs.writeFileSync(filename, '');
    if (err) {
        logger.logController(process.argv[1], 'Error crating file', 'error', "CreateFile");
        console.log("Error creating File");
        return 0;
    }
    return 1;
}
function fileExists(filename){
    var exists = fs.existsSync("./../"+filename);
    if (!exists) {
        logger.logController(process.argv[1], filename+' does not exists, creating it', 'info');
        createFile('./../'+filename);
    }
    return 1; 
}
function adressExists(adress){
    var contents = fs.readFileSync("./"+adress, 'utf8');
    var exists = contents.lastIndexOf(data);
    if (exists == -1)
        return 0;
    else
        return 1;
}
function findLast(filename) {
    var contents = fs.readFileSync("./" + filename, 'utf8');
    var last = contents.lastIndexOf('#');
    contents = contents.slice(last);
    if (last != -1) {
        last = contents.lastIndexOf('#');
        var laster = contents.lastIndexOf(' ');
        contents = contents.slice(last + 1, laster);
        var final = Number(contents);
        return final + 1;
    }
    else
        var final = 1;
    return final;
}
function addWhitelist(adress){
    if(fileExists(filename)){
        if(!(adressExists(adress))){
            fs.appendFile("./"+ filename, '#' + (findLast(filename))+" "+ adress+"\n", function (err){
                if (err) {
                    return console.log(err);
                }
                logger.logController(process.argv[1], adress + " added to file " + filename, "info");
            });
        }
        else {
            logger.logController(process.argv[1], adress+ "already added", "info");
        }
    }
    else{
        logger.logController(process.argv[1], "Error adding file", error, "Adding lines to whitelist.ini");
    }
}
exports.addWhitelist = addWhitelist;

function remWhitelist(adress){
    if (fileExists(filename)) {
        if ((adressExists(adress))) {
            var contents = fs.readFileSync("./" + filename, 'utf8');
            var first = contents.lastIndexOf(data);
            var firstPart = contents.slice(0, first);
            first = firstPart.lastIndexOf('#');
            firstPart = firstPart.slice(0, first);
            var last = contents.lastIndexOf(data);
            var lastPart = contents.slice(last);
            last = lastPart.indexOf('\n');
            lastPart = lastPart.slice(last + 1);
            var ny = firstPart + lastPart;
            fs.writeFileSync("./" + filename, ny, 'utf8');
        }
    }
}
exports.remWhitelist = remWhitelist;