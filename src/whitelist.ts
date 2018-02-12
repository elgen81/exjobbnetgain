//whitelist.ts
import File =  require("./file")

var file = new File

function whitelist(action:string, adress:string) {
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
    }
}
export = whitelist