import mongoose = require("mongoose");
import * as File from "./file";
import { IDestinationListModel } from "./models/destinationList"
import { IMsgModel } from "./models/msg"
import { IQueueListModel } from "./models/queueList"
import { logController} from "./logger"


interface ICallbackB{
	( error: Error, status:boolean ) :void
}
interface ICallbackQ{
	( error: Error, result:IQueueListModel ) :void
}
interface ICallbackData{
    (error:Error, status:string) :void
}
interface ICallbackAny{
    (error:Error, status:any[]) :void
}
//Instantiate DestinationList collection to represent whitelist.ini
export function destinationListSetup(file,callback?:ICallbackB){
	if(!callback){
        callback = function(){}
    };
	var destinationList = mongoose.model("DestinationList");
	File.getAllLinesAsTuple(file,function(err,whitelistAll:Array<[number, string]>){ //[[2, "hej"], [3, "då"], [5, "sometahing"]]
		if(!err){
			destinationList.update({}, {active: false})
			var destinationListAll = destinationList.find({});

			for(let entry of whitelistAll){
				destinationList.count({queueId: entry[0]} && {destination: entry[1]}, function(err, count){
					if(count > 0){
						destinationList.update({ queueId: entry[0]} && {destination: entry[1]}, {active: true});
						logController(process.argv[1], entry+ ' now active.', "info")
						callback(null,true)
					}
					else{
						var newDestination = new destinationList({
							queueId: entry[0],
							destination: entry[1],
							active: true
						});
						newDestination.save(function(err){
							if(err){ 
								logController(process.argv[1], 'Error adding new destination', "error", "New Destination")
								callback(err,false)
							}
							else{ 
								logController(process.argv[1], "New destination added: " + entry[0].toString +" "+ entry[1], "info")
								callback(null,true)
							}
						});
					}
				})
			}
		}
		else{
			logController(process.argv[1], err, "error")
			callback(err,false)
		}
	})
}

function doesQueueExists(destination, callback?:ICallbackB):void{
	var QueueList = mongoose.model("QueueList");
	if(!callback){callback = function(){}};
	var doesExist:boolean = false;

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

//Retrieves the first element in the message array of a queue document
export function queuePop(queueId:number, callback?:ICallbackQ){
	if(!callback){callback = function(){}};
	var Queue = mongoose.model("QueueList");
	var Msg = mongoose.model("Msg");

	Queue.findOne({queueId: queueId}, function(err, queue:IQueueListModel){
		if(err)
			{ callback(err, null) }
		else if(!queue)
			{ callback(new Error("Could not find queue"), null)}
		else{
			if(queue.msgArray.length <= 0)
			{
				callback(new Error("Queue is empty"), null);
			}
			else if(queue.lastSentMsg)
			{
				Msg.findOne( {_id: queue.lastSentMsg}, function(err, msg:IMsgModel){
					if(err) {callback(err, null)}

					if(msg.isSent)
					{
						queue.lastSentMsg = queue.msgArray.shift()
						queue.lengthOfQueue = queue.msgArray.length;
						queue.save(function(err, queue){
							if(err){ callback(err, null) }
							else { callback(null, queue) }
						})
					}
					else
					{
						callback(null, queue)
					}
				})
			}
			else
			{
				queue.lastSentMsg = queue.msgArray.shift()
				queue.lengthOfQueue = queue.msgArray.length;
				queue.save(function(err, queue){
					if(err){ callback(err, null) }
					else { callback(null, queue) }
				})
			}
		}
	})
}

export function activeMsg(callback?: ICallbackData){
	if(!callback){
        callback = function(){}
    };
	var Msg = mongoose.model("Msg");	
	Msg.find({
        isSorted: true,
        isSent: false
    }).count(function (err, count) {
        if (err) {
			logController(process.argv[1], err, "error", process.argv[2]);
			callback(err,null);
        }
        else {
		callback(null,count.toString())
		}
	})	   
}

export function activeQueues(callback?:ICallbackData){
	if(!callback){
        callback = function(){}
    };
	var QueueList = mongoose.model("QueueList");
	QueueList.find({
        lengthOfQueue: { $gt: 0 }
    }).count(function (err, count) {
        if (err) {
			logController(process.argv[1], err, "error", process.argv[2]);
			callback(err,null)
        }
        else {
            callback(null,count.toString())
        }
    })
}

export function listActive(callback?:ICallbackAny){
	if(!callback){
        callback = function(){}
    };
	var Msg = mongoose.model("Msg");
	Msg.aggregate([
		{$match:{'isSorted':true,'isSent':false}
		},
		{$project: {"_id" : false, queueId : 1,
		sender : 1,receiver : 1, timeReceived : 1}
		}
		]).exec(function(err,data){
			if(err){
				logController(process.argv[1], err, "error", process.argv[2]);
				callback(err,null)
			}
			else{
				logController(process.argv[1], "Sending Active List to frontend" , "info");
				callback(null,data)
			}
		})
}
