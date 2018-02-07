//whitelist.ts
import File =  require("../dist/file")

var file = new File

function whitelist(action:string, adress:string) {
    switch(action){
    case'add':
        console.log("Add "+adress+" to whitelist")
        file.appendLine('whitelist', adress)
    break
    case'remove':
        console.log("Remove "+adress+" from whitelist")
    break
    case'display':
        file.showFile('whitelist')
    break
    }
}
export = whitelist