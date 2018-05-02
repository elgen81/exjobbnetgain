//file.ts
//import { readFileSync, writeFileSync, readFile } from "fs";
import * as fs from "fs";
import { create } from "domain";
import { logController} from './logger'
import {logger} from './logger'

interface ICallback{
    (error:Error, status:boolean) :void
}
interface ICallbackData{
    (error:Error, status:string) :void
}

export function fileToString(filename:string,callback?: ICallbackData){
    logController(process.argv[1], "Converting "+filename, "info")
    if(!callback){callback = function(){}};
    if(exists(filename)){
             var data = fs.readFile(filename, "utf8", function(err,data){
             if(err){
                 logController(process.argv[1], err, 'error', "Problem with reading File")
                 callback(err, "");
             }
             else{
                logController(process.argv[1], 'Read file content from '+filename, 'info')
                callback(null, data);
             }
        })
    }
    else{
         logController(process.argv[1], 'File does not exist', 'error', 'Printing file content')
         callback(new Error("File does not exist")," ")
     }
 }

 function exists(filename:string){
    fs.exists(filename,function(exists){
        if(!exists){
            logController(process.argv[1], filename+ ' does not exist', 'info')
            return 0;    
        }
        else{
            return 1
        }     
    })
      
}

export function appendLine(filename:string, data:string, callback?: ICallback){
   logController(process.argv[1], filename+" "+data, "info")
    if(!callback){callback = function(){}};
    fileExists(filename,function(err,status){
        if(!status){
            callback(err,false)
        }
        else{
            dataExists(filename, data,function(err,status){
                if(!status){
                    logController(process.argv[1], err, 'error', "Data does not exist")
                    callback(err,false)
                }
                else{
                    fs.appendFile("./"+filename, '#'+(findLast(filename))+" "+data+"\n", function(err){
                        if(err){
                        logController(process.argv[1], err, 'error', "Problem with appendFile")
                        allback(err, false);
            }
            logController(process.argv[1], data+' added to file '+filename, 'info')
                callback(null,true);
            })
        }
        else{
            logController(process.argv[1], data +' already added', 'info')
            callback(new Error("Already Added"), false)
        }
    })

        
    }
    else{
        logController(process.argv[1], 'Error adding to file', 'error', 'Adding lines to .ini')
        callback(new Error("Error creating file"),false)
    }
}

export function fileExists(filename:string,callback?:ICallback){
    fs.exists(filename,function(exists){
        if(!exists){
            logController(process.argv[1], filename+ ' does not exists, creating it', 'info')
            fs.writeFile('filename','',function(test){
                if(!test){
                    callback(new Error("Couldn't create "+filename), false);
                }
            callback(null,true)
            })    
        }
        else{
            callback(null,true)
        }
    })
}

function dataExists(filename:string, data, callback?:ICallback){
    fs.readFile("./"+filename, 'utf8', function(err,data){
        if(err){
            
        }
    })
    var exists = contents.lastIndexOf(data)
    if(exists == -1)
        return 0
    else
        return 1  
}
function findLast(filename:string):number{
    var contents = fs.readFileSync("./"+filename, 'utf8')
    var last = contents.lastIndexOf('#') 
    contents = contents.slice(last)
    if(last!=-1){
        last = contents.lastIndexOf('#')
        var laster = contents.lastIndexOf(' ')
        contents = contents.slice(last+1,laster)
        var final = Number(contents)
        return final+1
    }
    else
        var final=1
        return final
}
export function removeLine(filename:string, data:string,callback?:ICallback){
    if(!callback){callback = function(){}};
    if(exists(filename)){
        if((dataExists(filename, data))){
            var contents = fs.readFileSync("./"+filename, 'utf8')
            var first = contents.lastIndexOf(data)
            var firstPart = contents.slice(0,first)
            first = firstPart.lastIndexOf('#')
            firstPart = firstPart.slice(0,first)
            var last = contents.lastIndexOf(data)
            var lastPart = contents.slice(last)
            last = lastPart.indexOf('\n')
            lastPart = lastPart.slice(last+1)
            var ny = firstPart+lastPart
            fs.writeFileSync("./"+filename, ny, 'utf8')
            logController(process.argv[1], data +' removed from '+filename, 'info')
            callback(null,true);
        }
        else{
        logController(process.argv[1], data +' adress missing in '+filename, 'info')
        callback(new Error(data+" not in list"),false)
        }
    }
    else{
        logController(process.argv[1], 'Error removing from file', 'error', 'removing lines from'+filename)
        callback(new Error(filename+" does not exist"),false);
    }
}
export function getLineAsTupleById(filename:string, data:number){
    filename = filename+".ini"
    var ndata = "#"+data
    let tuple: [number,string]
    if(fileExists(filename)){
        if((dataExists(filename, ndata))){
            var contents = fs.readFileSync("./"+filename, 'utf8')
            var first = contents.indexOf(ndata)
            var firstPart = contents.slice(first+1)
            first = firstPart.indexOf(' ')
            var id = firstPart.slice(0,first)
            firstPart = firstPart.slice(first+1)
            first = firstPart.indexOf('\n')
            var adress = firstPart.slice(0,first)
            tuple = [+id, adress]
            console.log(tuple)
            return tuple
        }
    }
}
export function getLineAsTupleByName(filename:string, data:string){
    filename = filename+".ini"
    let tuple: [number,string]
    if(fileExists(filename)){
        if((dataExists(filename, data))){
            var contents = fs.readFileSync("./"+filename, 'utf8')
            var first = contents.indexOf(data)
            var id = contents.slice(0,first)
            first = id.lastIndexOf('#')
            var first2 = id.lastIndexOf(" ")
            id = id.slice(first+1,first2)
            var last = contents.lastIndexOf(data)
            var adress = contents.slice(last)
            var last2 = adress.indexOf("\n")
            adress = adress.slice(0,last2)
            tuple = [+id,adress]
            console.log(tuple)
            return tuple
        }
    }
}
export function getAllLinesAsTuple(filename){
    filename = filename+".ini"
    let tuple: Array<[number,string]>
    tuple = []
    if(fileExists(filename)){
        var contents = fs.readFileSync("./"+filename, 'utf8')
            var isNumber:number = contents.lastIndexOf("#")
            if(isNumber !=-1){
                var nytt = contents.replace(/\n/g, ",")
                nytt = nytt.replace(/#/g,"")
                nytt = nytt.replace(/ /g, ",")
                var last = nytt.lastIndexOf(",")
                nytt = nytt.slice(0,last)
                var nytt2 = nytt.split(",")
                for(var i=0; i<nytt2.length; i=i+2){
                    tuple.push([+nytt2[i],nytt2[i+1]])
                }
                console.log(tuple)
                return tuple
        }
        else{
            logController(process.argv[1], filename +' is empty', 'info')
            return []
        }
    }
    else{
        logController(process.argv[1], 'File is empty', 'info')
        return []
    }    
}