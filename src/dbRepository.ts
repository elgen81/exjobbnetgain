import mongoose = require("mongoose");
import file = require("./file");
import { IDestinationListModel } from "./models/destinationList"
import { IMsgModel } from "./models/msg"
import { IQueueListModel } from "./models/queueList"


interface ICallback{
	( error: Error, staus:boolean ) :void
}
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

export function doesQueueExists(destination, callback?:ICallback):void{
	var QueueList = mongoose.model("QueueList");
	if(!callback){callback = function(){}};var doesExist:boolean = false;

	QueueList.find({queueId: destination}, function(err, queue){
		console.log("queue: " + queue)
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
export function queuePush(destination, msgId, callback?: ICallback){
	var Msg = mongoose.model("Msg");
	var Queue = mongoose.model("QueueList");
	if(!callback){callback = function(){}};

	console.log("Dest: "+ destination)
	Msg.findById(msgId, function(err, msg:IMsgModel){
		doesQueueExists(destination, function(err, status){
			console.log("Pushing " + msg._id + " to Queue with destination " + destination)
			if(err){throw err}
			if(status)
			{
				Queue.update(
					{ queueId: destination },
					{ $push: {msgArray: msg} },
					function(err){
						if(err) {
							console.log(err)
							callback(err, false)}
						else
						{
						Queue.update(
							{ queueId: destination },
							{ $inc: { lengthOfQueue: 1} },
							function(err){
								if(err){ 
									console.log(err)
									callback(err, false)}
								else
								{	Queue.findOne({ queueId: destination}).populate('msgArray',function(err){});
									callback(null, true);
								}
							})
						}

					}
				);
			}	
		else{
			var newQueue = new Queue({
				queueId: msg.queueId,
				lengthOfQueue: 1,
				msgArray: [msg]
			});
			newQueue.save(function(err){
				if(err){
					console.log(err)
					callback(err, false)
				}
				else{
					callback(null, true);
				}
			});
		}
		})
			
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

