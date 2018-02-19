import mongoose = require("mongoose");
import file = require("./file");


//Instantiate DestinationList collection to represent whitelist.ini
export function destinationListSetup(){
	var File:file = new file();
	var destinationList = mongoose.model("DestinationList");
	var whitelistAll:Array<[number, string]> = File.getAllLinesAsTuple("whitelist"); //[[2, "hej"], [3, "då"], [5, "sometahing"]]
	destinationList.update({}, {active: false})
	var destinationListAll = destinationList.find({});

	for(let entry of whitelistAll){
	  destinationList.count({queueID: entry[0]} && {destination: entry[1]}, function(err, count){
	    if(count > 0)
	    {
	      destinationList.update({ queueID: entry[0]} && {destination: entry[1]}, {active: true});
	      console.log(entry +" now active.");  
	    }
	    else
	    {
	      var newDestination = new destinationList({
	        queueID: entry[0],
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

export function doesQueueExists(queueId:string):boolean{
	return false;
}


export function startNewQueue():boolean{
	return false;
}
//Push a new message onto the end of the message array in a queue document
export function queuePush(queueId:string, msgId:string){
	var Msg = mongoose.model("Msg");
	var Queue = mongoose.model("QueueList");
	var errReturn;
	Msg.findById(msgId, function(err, msg){
		Queue.update(
			{ queueID: queueId },
			{ $push: {msgArray: msg} });
		Queue.update(
			{ queueID: queueId },
			{ $inc: { lengthOfQueue: 1} });
		errReturn = err;
	});
	return errReturn;
}

//Retrieves the first element in the message array of a queue document
export function queuePop(queueId:string){

	var Queue = mongoose.model("QueueList");
	var msgReturn;
	Queue.update(
		{ queueID: queueId},
		{ $pop: { msgArray: -1} }, function(err, msg){
			msgReturn = msg;
		});
	Queue.update(
			{ queueID: queueId },
			{ $inc: { lengthOfQueue: -1} });
	return msgReturn;
}

