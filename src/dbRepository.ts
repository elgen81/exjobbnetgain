import mongoose = require("mongoose");
import * as File from "./file";
import { IDestinationListModel } from "./models/destinationList"
import { IMsgModel } from "./models/msg"
import { IQueueListModel } from "./models/queueList"
import { logController} from "./logger"


interface ICallbackB{
	( error: Error, staus:boolean ) :void
}
interface ICallbackQ{
	( error: Error, result:IQueueListModel ) :void
}
//Instantiate DestinationList collection to represent whitelist.ini
export function destinationListSetup(){

	var destinationList = mongoose.model("DestinationList");
	var whitelistAll:Array<[number, string]> = File.getAllLinesAsTuple("whitelist"); //[[2, "hej"], [3, "då"], [5, "sometahing"]]
	destinationList.update({}, {active: false})
	var destinationListAll = destinationList.find({});

	for(let entry of whitelistAll){
	  destinationList.count({queueId: entry[0]} && {destination: entry[1]}, function(err, count){
	    if(count > 0)
	    {
		  destinationList.update({ queueId: entry[0]} && {destination: entry[1]}, {active: true});
		  logController(process.argv[1], entry+ ' now active.', "info")
	    }
	    else
	    {
	      var newDestination = new destinationList({
	        queueId: entry[0],
	        destination: entry[1],
	        active: true
	      });
	      newDestination.save(function(err){
	      if(err){ 
				logController(process.argv[1], 'Error adding new destination', "error", "New Destination")
			}
	      else{ 
				logController(process.argv[1], "New destination added: " + entry[0].toString +" "+ entry[1], "info")
			}
	      });
	    }
	  });
	}
}

export function doesQueueExists(destination, callback?:ICallbackB):void{
	var QueueList = mongoose.model("QueueList");
	if(!callback){callback = function(){}};var doesExist:boolean = false;

	QueueList.find({queueId: destination}, function(err, queue){
		logController(process.argv[1], "Queue: " + queue, "info")
		if(err){
			callback(err, false);
		}
		else{
			if(queue.length > 0){
				callback(null, true)
			}
			else{
				callback(null, false);
			}
		}
	})
}


export function startNewQueue():boolean{
	return false;
}


//Push a new message onto the end of the message array in a queue document
export function queuePush(destination, msgId, callback?: ICallbackB){
	var Msg = mongoose.model("Msg");
	var Queue = mongoose.model("QueueList");
	if(!callback){callback = function(){}};
	logController(process.argv[1], "Destination: "+destination, "info")
		doesQueueExists(destination, function(err, status){
			logController(process.argv[1], "Pushing " + msgId + " to queue with destination " + destination, "info")
			if(err){
				logController(process.argv[1], err, "error", 'queuePush')
			}
			if(status)
			{
				Queue.findOne({queueId: destination}, function(err, queue:IQueueListModel){
					queue.msgArray.push(msgId)
					queue.lengthOfQueue = queue.msgArray.length
					queue.save(function(err, queue:IQueueListModel){
						queue.populate('msgArray')
						callback(null, true)
					})
				})
			}	
		else{
			var newQueue = new Queue({
				queueId: destination,
				lengthOfQueue: 1,
				lastSentMsg: null,
				timeOfLastSent: null,
				msgArray: [msgId]
			});
			newQueue.save(function(err, queue){
				if(err){
					logController(process.argv[1], err, "error", "Create new queue")
					callback(err, false)
				}
				else{
					queue.populate('msgArray')
					callback(null, true);
				}
			});
		}
		})
}

/*
//Push a new message onto the end of the message array in a queue document
export function queuePush(destination, msgId, callback?: ICallback){
	var Msg = mongoose.model("Msg");
	var Queue = mongoose.model("QueueList");
	if(!callback){callback = function(){}};

	console.log("Dest: "+ destination)
	//Msg.findById(msgId, function(err, msg:IMsgModel){
		doesQueueExists(destination, function(err, status){
			console.log("Pushing " + msg._id + " to Queue with destination " + destination)
			if(err){throw err}
			if(status)
			{
				Queue.findOne({queueId: destination}, function(err, queue:IQueueListModel){
					queue.msgArray.push(msg._id)
					queue.lengthOfQueue = queue.lengthOfQueue + 1
					queue.save(function(err, queue:IQueueListModel){
						queue.populate('msgArray')
					})
				})
			}	
		else{
			var newQueue = new Queue({
				queueId: msg.queueId,
				lengthOfQueue: 1,
				msgArray: [msg._id]
			});
			newQueue.save(function(err, queue){
				if(err){
					console.log(err)
					callback(err, false)
				}
				else{
					queue.populate('msgArray')
					callback(null, true);
				}
			});
		}
		})
			
	//});
}


*/



//Retrieves the first element in the message array of a queue document
export function queuePop(queueId:number, callback?:ICallbackQ){
	if(!callback){callback = function(){}};
	var Queue = mongoose.model("QueueList");

	Queue.findOne({queueId: queueId}, function(err, queue:IQueueListModel){
		if(err)
			{ callback(err, null) }
		else if(!queue)
			{ callback(new Error("Could not find queue"), null)}
		else{
			console.log(queue)
			queue.lastSentMsg = queue.msgArray.shift()
			queue.lengthOfQueue = queue.msgArray.length;
			queue.save(function(err, queue){
				if(err){ callback(err, null) }
				else { callback(null, queue) }
			})
		}
	})
}

