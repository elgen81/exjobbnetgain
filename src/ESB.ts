
import child_proc = require("child_process")
import events = require("events")

var eventEmitter = new events.EventEmitter();

var serverProcess = child_proc.fork("./server.js", [])
var outPutProcesses:Array<[number, child_proc.ChildProcess]> = [];

serverProcess.on('data', (data) => {
  console.log(`grep stderr: ${data}`);
});

serverProcess.on('close', (code) => {
  if (code !== 0) {
    console.log(`input process exited with code ${code}`);
  }
});
process.on('SIGINT', (code) => {
  serverProcess.kill('SIGINT');
  for(let proc of outPutProcesses)
  {
  	proc[1].kill('SIGINT');
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
      var out  = child_proc.fork('./out.js', [dest])
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

serverProcess.on('message', (msg) =>{
  
  if(msg.msg = "newOut")
  {
    console.log(msg.id)
    eventEmitter.emit(msg.msg, msg.id)
  }

 /*
  console.log(msg)
  var display = child_proc.spawn('electron', ['.'])
  display.on('message', (msg) => {
    console.log(msg)
  })*/
})

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