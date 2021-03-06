
import child_proc = require("child_process")
import events = require("events")
import {logController} from './logger'
import { config } from "./_config";
import * as express from "express"
import * as mongoose from "mongoose"
export var eventEmitter = new events.EventEmitter();


//Child process management
  var serverProcess = null
  var outPutProcesses:Array<[number, child_proc.ChildProcess]> = [];
  var display = null

  process.on('SIGTERM', (code) => {
    if(serverProcess) { serverProcess.kill('SIGINT') }
    if(display) { display.kill('SIGINT'); }
    for(let proc of outPutProcesses)
    {
      if(proc[1]) { proc[1].kill('SIGINT'); }
    }
  });


//Events for input server
  eventEmitter.on("startInput", ()=> {
      console.log("in start, server: " + serverProcess)
      if(serverProcess) 
        { console.log("Input server aleready active") }
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
          if(msg == "newOut")
          {
            console.log(msg.id)
            eventEmitter.emit(msg.msg, msg.id)
          }
        })  
      }
      
  })

  eventEmitter.on("exitInput", () =>{
    if(serverProcess)
      {
        serverProcess.kill("SIGTERM") }
        serverProcess = null;
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
      { console.log("Display already active") }
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

//DATABASE CONNECTION
  //var uri:string = "mongodb://127.0.0.1/my_db";
  console.log(config.mongoURI[app.settings.env])
  var uri:string = config.mongoURI[app.settings.env]
  mongoose.connect(uri, (err) => {
    if (err) {
      logController(process.argv[1], err, "error", "Connection MongoDb")
    }
    else {
      logController(process.argv[1], "Connected to MongoDb", "info", "Connection MongoDb")

    }
  });

//Init database models
  require("./models/destinationList");
  require("./models/msg");
  require("./models/queueList");

//Routing config
  import MenuController = require("./menuController")
  app.use("/menu", MenuController)

  eventEmitter.emit("startInput");
  eventEmitter.emit("display");

  export function serverStatus():boolean{
    
    if(serverProcess)
      { return true}
    else
      { return false}
  }