import mongoose = require("mongoose");


//Instantiate DestinationList collection to represent whitelist.ini
export function destinationListSetup(){
	var destinationList = mongoose.model("DestinationList");
	var whitelistAll:Array<[number, string]> = [[2, "hej"], [3, "då"], [5, "sometahing"]]//=whitelist.getAll();
	destinationList.update({}, {active: false})
	var destinationListAll = destinationList.find({});

	for(let entery of whitelistAll){
	  destinationList.count({queueID: entery[0]} && {destination: entery[1]}, function(err, count){
	    if(count > 0)
	    {
	      destinationList.update({ queueID: entery[0]} && {destination: entery[1]}, {active: true});
	      console.log(entery +" now active.");  
	    }
	    else
	    {
	      var newDestination = new destinationList({
	        queueID: entery[0],
	        destination: entery[1],
	        active: true
	      });
	      newDestination.save(function(err){
	      if(err)
	        { console.log("Error adding new destination."); }
	      else
	        { console.log("New destination added: " + entery[0].toString +" "+ entery[1]); }
	      });
	    }
	  });
	}

	console.log(destinationList.find({}));
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
			{ _id: queueId},
			{ $push: {msgArray: msg} });
		errReturn = err;
	});
	return errReturn;
}

//Retrieves the first element in the message array of a queue document
export function queuePop(queueId:string){

	var Queue = mongoose.model("QueueList");
	var msgReturn;
	Queue.update(
		{ _id: queueId},
		{ $pop: { msgArray: -1} }, function(err, msg){
			msgReturn = msg;
		});
	return msgReturn;
}

