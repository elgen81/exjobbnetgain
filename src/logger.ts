import { format } from "util";

const winston = require('winston')

const fs = require('fs')
const logDir = 'log'
const errDir = 'errLog'

if(!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}
if(!fs.existsSync(errDir)){
    fs.mkdirSync(errDir)
}

const tsFormat = () => (new Date()).toLocaleTimeString()

export const logger = new (winston.createLogger)({
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple()
    ),
    transports: [
new (require('winston-daily-rotate-file'))({
    filename: './log/log',
    timestamp: tsFormat,
    datePattern: 'YYYY-MM-DD',
    prepend: true,
    level: 'info'
}),
new (require('winston-daily-rotate-file'))({
    filename: './errLog/log',
    timestamp: tsFormat,
    datePattern: 'YYYY-MM-DD',
    prepend: true,
    level: 'error'
})]
})
export function relPath(path:string){
    return path.replace(process.cwd(),"")
}
export function logController(path:string, err, severity, optional=''){
    path = path.replace(process.cwd(),"")
    switch(severity){
    case'error':
        logger.error("(%s), Path = %s, More info = %s",err, path,optional)
    break
    case'info':{
        logger.info("(%s), Path = %s, More info = %s",err, path,optional)
        console.log(err)
        }
    break
    default:{
        logger.warning("(%s), Path = %s, More info = %s",err, path,optional)
        console.log("No such severety: %s", severity)
        }
    }
}