//whitelist.ts
import File =  require("./file")

var file = new File

function whitelist(action:string, adress) {
    switch(action){
    case'add':
        console.log("Add "+adress+" to whitelist")
        var test = adress.match(/\w+\.\w+\.\w+\:\d+/g)
        console.log(test)
        if(test)
        file.appendLine('whitelist', adress)
        else
        console.log("follow the format zzz.adress.yyy:xxxx")
    break
    case'remove':
        console.log("Remove "+adress+" from whitelist")
        file.removeLine('whitelist',adress)
    break
    case'display':
        file.showFile('whitelist')
    break
    case'tupleId':
        file.getLineAsTupleById('whitelist', adress)
    break
    case'tupleName':
        file.getLineAsTupleByName('whitelist', adress)
    break
    case'tupleAll':
        file.getAllLinesAsTuple('whitelist')
    break
    }
}
export = whitelist