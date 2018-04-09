//whitelist.ts
import * as file from './file'
import {logController} from './logger'

function whitelist(action:string, adress) {
    switch(action){
    case'add':
        logController(process.argv[1], 'Add '+ adress + 'to whitelist', 'info')
        var test = adress.match(/\w+\.\w+\.\w+\:\d+/g)
        if(test)
        file.appendLine('whitelist', adress)
        else
        logController(process.argv[1], 'Follow the format zzz.adress.yyy:xxxx', 'info')
    break
    case'remove':
        logController(process.argv[1], 'Remove '+adress+' from whitelist', 'info')
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