import mongoose = require("mongoose");
import file = require("./file");
import { IDestinationListModel } from "./models/destinationList"
import { IMsgModel } from "./models/msg"
import { IQueueListModel } from "./models/queueList"



//Instantiate DestinationList collection to represent whitelist.ini
export function destinationListSetup(){
	var File:file = new file();
	var destinationList = mongoose.model("DestinationList");
	var whitelistAll:Array<[number, string]> = File.getAllLinesAsTuple("whitelist"); //[[2, "hej"], [3, "då"], [5, "sometahing"]]
	destinationList.update({}, {active: false})
	var destinationListAll = destinationList.find({});

	for(let entry of whitelistAll){
	  destinationList.count({queueId: entry[0]} && {destination: entry[1]}, function(err, count){
	    if(count > 0)
	    {
	      destinationList.update({ queueId: entry[0]} && {destination: entry[1]}, {active: true});
	      console.log(entry +" now active.");  
	    }
	    else
	    {
	      var newDestination = new destinationList({
	        queueId: entry[0],
	        destination: entry[1],
	        active: true
	      });
	      newDestination.save(function(err){
	      if(err)
	        { console.log("Error adding new destination."); }
	      else
	        { console.log("New destination added: " + entry[0].toString +" "+ entry[1]); }
	      });
	    }
	  });
	}
	//return true;
	//console.log(destinationList.find({}));
}

export async function doesQueueExists(destination):boolean{
	var QueueList = mongoose.model("QueueList");
	var doesExist:boolean = false;

	await QueueList.find({queueId: destination}, function(err, queue){
		console.log("queue: " + queue)
		if(err){
			doesExist = false;
		}
		else{
			if(queue.length > 0){
				doesExist = true;
			}
			else{
				doesExist = false;
			}
		}
	})
	console.log("doesExist: " + doesExist)
	return doesExist;
}


export function startNewQueue():boolean{
	return false;
}
//Push a new message onto the end of the message array in a queue document
export function queuePush(destination, msgId){
	var Msg = mongoose.model("Msg");
	var Queue = mongoose.model("QueueList");
	var errReturn;
	console.log("Dest: "+ destination)
	Msg.findById(msgId, function(err, msg:IMsgModel){
		if(doesQueueExists(destination)){
			Queue.update(
				{ queueId: destination },
				{ $push: {msgArray: msg} });
			Queue.update(
				{ queueId: destination },
				{ $inc: { lengthOfQueue: 1} });
		}
		else{
			var newQueue = new Queue({
				queueId: msg.queueId,
				lengthOfQueue: 1,
				msgArray: [msg]
			});
			newQueue.save(function(err){console.log(err)});
		}
	});
}

//Retrieves the first element in the message array of a queue document
export function queuePop(queueId:string){

	var Queue = mongoose.model("QueueList");
	var msgReturn;
	Queue.update(
		{ queueId: queueId},
		{ $pop: { msgArray: -1} }, function(err, msg){
			msgReturn = msg;
		});
	Queue.update(
			{ queueId: queueId },
			{ $inc: { lengthOfQueue: -1} });
	return msgReturn;
}

