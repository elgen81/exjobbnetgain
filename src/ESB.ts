
import child_proc = require("child_process")
import events = require("events")

var eventEmitter = new events.EventEmitter();

var serverProcess = child_proc.fork("./dist/server.js", [])
var outPutProcesses:Array<[number, child_proc.ChildProcess]> = [];
var display = null;

//Events for input server
serverProcess.on('data', (data) => {
  console.log(`grep stderr: ${data}`);
});

serverProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`input process exited with code ${code}`);
  }
});
serverProcess.on('message', (msg) =>{
  
  if(msg.msg = "newOut")
  {
    console.log(msg.id)
    eventEmitter.emit(msg.msg, msg.id)
  }
  if(msg.msg = "display")
  {
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
  }
})

process.on('SIGINT', (code) => {
  if(serverProcess) { serverProcess.kill('SIGINT'); }
  if(display) { display.kill('SIGINT'); }
  for(let proc of outPutProcesses)
  {
  	if(proc[1]) { proc[1].kill('SIGINT'); }
  }
});

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