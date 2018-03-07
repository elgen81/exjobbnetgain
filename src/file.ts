//file.ts
import { readFileSync, writeFileSync, readFile } from "fs";
import { create } from "domain";
import { logController} from './logger'
const {logger} = require('./logger')

class file {
    private fs = require('fs')

    constructor(){}

    showFile(filename:string){
        this.fs.readFile("./"+filename+".ini", function (err, data){
            if(err){
                logController(process.argv[1], err, 'error')
                return console.log(filename+".ini is empty")
            }
        console.log(data.toString());
        });
    }
    
    appendLine(filename:string, data:string){
        filename = filename+'.ini'
        if(this.fileExists(filename)){
            if(!(this.dataExists(filename, data))){
                this.fs.appendFile("./"+filename, '#'+(this.findLast(filename))+" "+data+"\n", function(err){
                if(err){
                    return console.log(err);
                }
                logController(process.argv[1], data+' added to file '+filename, 'info')
                })
            }
            else{
                logController(process.argv[1], data +'already added', 'info')
            }
        }
        else{
            logController(process.argv[1], 'Error adding to file', 'error', 'Adding lines to .ini')
        }
    }
    
    fileExists(filename:string){
        var exists = this.fs.existsSync("./"+filename)
            if(!exists){
                logController(process.argv[1], filename+ ' does not exists, creating it', 'info')
                var res = this.createFile('./'+filename)
                if(!res){
                    return 0
                }
            }
        return 1       
    }
    
    createFile(filename:string){
        var err = this.fs.writeFileSync(filename,'')
        if(err){
            logController(process.argv[1], 'Error crating file', 'error', "CreateFile")
            console.log("Error creating File")
            return 0
        }
        return 1
    }

    dataExists(filename:string, data){
        var contents = readFileSync("./"+filename, 'utf8')
        var exists = contents.lastIndexOf(data)
        if(exists == -1)
            return 0
        else
            return 1  
    }
    findLast(filename:string):number{
        var contents = readFileSync("./"+filename, 'utf8')
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
    removeLine(filename:string, data:string){
        filename = filename+".ini"
        if(this.fileExists(filename)){
            if((this.dataExists(filename, data))){
                var contents = readFileSync("./"+filename, 'utf8')
                var first = contents.lastIndexOf(data)
                var firstPart = contents.slice(0,first)
                first = firstPart.lastIndexOf('#')
                firstPart = firstPart.slice(0,first)
                var last = contents.lastIndexOf(data)
                var lastPart = contents.slice(last)
                last = lastPart.indexOf('\n')
                lastPart = lastPart.slice(last+1)
                var ny = firstPart+lastPart
                writeFileSync("./"+filename, ny, 'utf8')
            }
        }
    }
    getLineAsTupleById(filename:string, data:number){
        filename = filename+".ini"
        var ndata = "#"+data
        let tuple: [number,string]
        if(this.fileExists(filename)){
            if((this.dataExists(filename, ndata))){
                var contents = readFileSync("./"+filename, 'utf8')
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
    getLineAsTupleByName(filename:string, data:string){
        filename = filename+".ini"
        let tuple: [number,string]
        if(this.fileExists(filename)){
            if((this.dataExists(filename, data))){
                var contents = readFileSync("./"+filename, 'utf8')
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
    getAllLinesAsTuple(filename){
        filename = filename+".ini"
        let tuple: Array<[number,string]>
        tuple = []
        if(this.fileExists(filename)){
            var contents = readFileSync("./"+filename, 'utf8')
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
                logController(process.argv[1], filename +'is empty', 'info')
                return []
            }
        }
        else{
            logController(process.argv[1], 'File is empty', 'info')
            return []
        }    
    }
}
export = file