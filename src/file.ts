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
interface ICallbackNumber{
    (error:Error, status:number) :void
}
interface ICallbackTuple{
    (error:Error, status:object ) :void
}

export function fileToString(filename:string,callback?: ICallbackData){
    logController(process.argv[1], "Converting "+filename, "info")
    if(!callback){callback = function(){}};
    fs.open(filename,'r',function(err,data){
        if(!err){
            fs.readFile(filename, "utf8", function(err,data){
                if(!err){
                    logController(process.argv[1], 'Read file content from '+filename, 'info')
                    callback(null, data);
                }
                else{
                    logController(process.argv[1], err, 'error', "Problem with reading File")
                    callback(err, "");
                }                
            })
        }
        else{
            logController(process.argv[1], 'File does not exist', 'error', 'Printing file content')
            callback(new Error("File does not exist")," ")
        }
    })
}

export function exists(filename:string, callback?: ICallback){
    var status = fs.existsSync(filename)
    if(status){
        callback(null, true)
    }
    else{
        callback(new Error(filename+" does not exist"),false)
    }
}

export function appendLine(filename:string, data:string, callback?: ICallback){
    if(!callback){callback = function(){}};
    fileExists(filename,function(err,status){
        if(err){
            callback(err,false)
        }
        else{
            dataExists(filename, data,function(err,status){
                if(status){
                    logController(process.argv[1], err, 'error')
                    callback(err,false)
                }
                else{
                    findLast(filename,function(err,position){
                        fs.appendFile(filename, '#'+position+" "+data+"\n", function(err){
                            if(err){
                                logController(process.argv[1], err, 'error', "Problem with appendFile")
                                callback(err, false);
                            }
                            else{
                                callback(null,true)
                            }
                        })
                    })
                }
            })
        }
    })
}

export function fileExists(filename:string, callback?:ICallback){
    fs.open(filename,'a+',function(err,file){
        if(err){
            logController(process.argv[1],"couldn't open "+filename,'error')
        }
        else{
            callback(null,true);
        }
    })
}

function dataExists(filename:string, data, callback?:ICallback){
    fs.readFile(filename, 'utf8', function(err,file){
        if(err){
            callback(new Error("could not read "+filename),false);
        }
        else{
            var exists = file.lastIndexOf(data)
            if(exists == -1){
                callback(null, false)
            }
            else{
                callback(new Error("The line is already in "+filename), true)
            }
        }
    })
}

function findLast(filename:string,callback?:ICallbackNumber){
    fs.readFile(filename, 'utf8',function(err,contents){
        if(err){
            logController(process.argv[1],err,'error')
        }
        else{
            var last = contents.lastIndexOf('#') 
            contents = contents.slice(last)
            if(last!=-1){
                last = contents.lastIndexOf('#')
                var laster = contents.lastIndexOf(' ')
                contents = contents.slice(last+1,laster)
                var final = Number(contents)
                callback(null,final+1)
            }
            else{
                final = 1;
                callback(null,final)
            }
        }
    })
}

export function removeLine(filename:string, data:string,callback?:ICallback){
    if(!callback){
        callback = function(){}
    };
    exists(filename,function(err,status){
        if(status){
            dataExists(filename, data,function(err,status){
                if(status){
                    fs.readFile("./"+filename, 'utf8',function(err,contents){
                        if(!err){
                            logController(process.argv[1], "after readfile " ,'info')
                            var first = contents.lastIndexOf(data)
                            var firstPart = contents.slice(0,first)
                            first = firstPart.lastIndexOf('#')
                            firstPart = firstPart.slice(0,first)
                            var last = contents.lastIndexOf(data)
                            var lastPart = contents.slice(last)
                            last = lastPart.indexOf('\n')
                            lastPart = lastPart.slice(last+1)
                            var ny = firstPart+lastPart
                            logController(process.argv[1], ny ,'info')
                            fs.writeFile("./"+filename, ny, 'utf8',function(err){
                                if(!err){
                                    logController(process.argv[1], data +' removed from '+filename, 'info')
                                    callback(null,true);
                                }
                                else{
                                    logController(process.argv[1], "Problem saving "+filename, 'error')
                                    callback(err,false)
                                }
                            })
                        }
                        else{
                            logController(process.argv[1], "Problem reading "+filename, "error")
                            callback(err,false)
                        }
                    })
                }
                else{
                    logController(process.argv[1], data +' adress missing in '+filename, 'info')
                    callback(new Error(data+" not in list"),false)
                }
            })
        }
        else{
            logController(process.argv[1], 'Error removing from file', 'error', 'removing lines from'+filename)
            callback(new Error(filename+" does not exist"),false);
        }
    })    
}

export function getLineAsTupleById(filename:string, data:number,callback?: ICallbackTuple){
    var ndata = "#"+data
    let tuple: [number,string]
    fileExists(filename,function(err,status){
        if(status){
            dataExists(filename,ndata,function(err,status){
                if(status){
                    fs.readFile("./"+filename, 'utf8',function(err,contents){
                        if(!err){
                            var first = contents.indexOf(ndata)
                            var firstPart = contents.slice(first+1)
                            first = firstPart.indexOf(' ')
                            var id = firstPart.slice(0,first)
                            firstPart = firstPart.slice(first+1)
                            first = firstPart.indexOf('\n')
                            var adress = firstPart.slice(0,first)
                            tuple = [+id, adress]
                            callback(null, tuple)
                        }
                        else{
                            callback(err,null)
                        }
                    })
                }
                else{
                    callback(err,null)
                }
            })
        }
        else{
            callback(err,null)
        }
    })
}

export function getLineAsTupleByName(filename:string, data:string,callback?:ICallbackTuple){
    let tuple: [number,string]
    fileExists(filename,function(err,status){
        if(status){
            dataExists(filename, data, function(err,status){
                if(status){
                    fs.readFile("./"+filename, 'utf8',function(err,contents){
                        if(!err){
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
                            callback(null,tuple)
                        }
                        else{
                            callback(err,null)
                        }
                    })
                }
                else{
                    callback(err,null)
                }
            })
        }
        else{
            callback(err,null)
        }
    })
}
export function getAllLinesAsTuple(filename,callback?:ICallbackTuple){
    let tuple: Array<[number,string]>
    tuple = []
    fileExists(filename,function(err,status){
        if(status){
            fs.readFile("./"+filename, 'utf8',function(err,contents){
                if(!err){
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
                        callback(null,tuple)
                    }    
                    else{
                        callback(new Error("File is empty"),null)
                    }
                }
                else{
                    callback(err,null)
                }
            })
        }
        else{
            callback(err,null)
        }
    })    
}