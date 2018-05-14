
import child_proc = require("child_process")
import events = require("events")
import {logController} from './logger'
import { config } from "./_config";
import * as express from "express"
export var eventEmitter = new events.EventEmitter();


//Child process management
  var serverProcess = child_proc.fork("./dist/server.js", [])
  var outPutProcesses:Array<[number, child_proc.ChildProcess]> = [];
  var display = child_proc.spawn('electron', ['.']);

  process.on('SIGTERM', (code) => {
    if(serverProcess) { serverProcess.kill('SIGINT') }
    if(display) { display.kill('SIGINT'); }
    for(let proc of outPutProcesses)
    {
      if(proc[1]) { proc[1].kill('SIGINT'); }
    }
  });
  eventEmitter.emit("startInput");

//Events for input server
  eventEmitter.on("startInput", ()=> {
      console.log("in start, erver: " + serverProcess)
      if(serverProcess) 
        { console.log("Input server aleready acrive") }
      else{
        serverProcess = child_proc.fork("./dist/server.js", [])

        serverProcess.on('data', (data) => {
          console.log(`Input stderr: ${data}`);
        });

        serverProcess.on('close', (code) => {
          if (code !== 0) {
            console.log(`input process exited with code ${code}`);
            serverProcess = null;
          }
        });

        serverProcess.on('message', (msg) =>{
          if(msg.msg = "newOut")
          {
            console.log(msg.id)
            eventEmitter.emit(msg.msg, msg.id)
          }
        })  
      }
      
  })

  eventEmitter.on("exitInput", () =>{
    if(serverProcess)
      {  serverProcess.send("exit") }
  })

  
//Events for output server
  eventEmitter.on('newOut', (dest) => {
    console.log(dest)
    console.log("Starting new output")

    var status = false;
    for(var i=0; i < outPutProcesses.length; i++)
    {
      if(outPutProcesses[i][0] = dest)
        { status = true; }
    }

    if(status)
      { console.log("Output " + dest + " is already running") }
    else
      {
        var out  = child_proc.fork('./dist/out.js', [dest])
        out.on('close', (code) => {
          if (code !== 0) {
            console.log(`output process exited with code ${code}`);
          }
          outPutProcesses.splice(outPutProcesses.indexOf([dest, out]),1)
          })
        out.on('message', (msg)=>{
          if(msg.msg = "outDone")
          {
            eventEmitter.emit(msg.msg, msg.id)
          }
        })
        out.send(dest);
        outPutProcesses.push([dest, out]);
      }
  });

  eventEmitter.on("outDone", (id)=>{
    var ids = []
    for(var i=0; i < outPutProcesses.length; i++)
    {
      ids.push(outPutProcesses[i][0]);
    }
    var index = ids.indexOf(id)
    var out = outPutProcesses[index][1];
    console.log("killing ID: " + id)
    out.kill('SIGINT')

    outPutProcesses.splice(index, 1);
  })


  eventEmitter.on("display", () =>{
    if(display) 
      { console.log("Display aleready acrive") }
    else
      {
        display = child_proc.spawn('electron', ['.']);
        display.on('close', (code) => {
        if (code !== 0) {
          console.log(`output process exited with code ${code}`);
        }
        display = null;
        })
      }

  })
  
//Menuserver setup and controll
  const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager

  var port:number = config.menuPort || 3030;
  var app = express()
  var server = app.listen(port, function(err){
    if(err) { 
      logController(process.argv[1], err, 'error', "Listening on port")
     }
    else{
      console.log("Express server listening on port " + port);
    }
  });
  import MenuController = require("./menuController")
  app.use("/menu", MenuController)