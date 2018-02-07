import { readFileSync } from "fs";
import { create } from "domain";

class file {
    private fs = require('fs')

    constructor(){}

    showFile(filename:string){
        this.fs.readFile("../dist/"+filename+".ini", function (err, data){
            if(err){
                return console.log(filename+".ini is empty")
            }
        console.log(data.toString());
        });
    }
    
    appendLine(filename:string, data:string){
        filename = filename+'.ini'
        if(this.fileExists(filename)){
            if(!(this.dataExists(filename, data))){
                this.fs.appendFile("../dist/"+filename, '#'+(this.findLast(filename))+" "+data+"\n", function(err){
                if(err){
                    return console.log(err);
                }
                console.log(data+" added to file "+filename)
                })
            }
            else{
                console.log(data+" already added")
            }
        }
        else{
            console.log("Error adding to file")
        }
    }
    
    fileExists(filename:string){
        var exists = this.fs.existsSync("../dist/"+filename)
            if(!exists){
                console.log(filename+" does not exist creating")
                var res = this.createFile('../dist/'+filename)
                if(!res){
                    return 0
                }
            }
        return 1       
    }
    
    createFile(filename:string){
        var err = this.fs.writeFileSync(filename,'')
        if(err){
            console.log("Error creating File")
            return 0
        }
        return 1
    }

    dataExists(filename:string, data:string){
        var contents = readFileSync("../dist/"+filename, 'utf8')
        var exists = contents.lastIndexOf(data)
        if(exists == -1)
            return 0
        else
            return 1  
    }
    findLast(filename:string):number{
        var contents = readFileSync("../dist/"+filename, 'utf8')
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
}
export = file