import mongoose = require("mongoose");
/*import Msg = require("./models/msg");
import DestinationList = require("./models/destinationList");
import QueueList = require("./models/queueList");*/

class sorter{


	static sortElem(msgId:string):void {
		console.log("In sorter");
		console.log("msgId = " + msgId);
		var Msg = mongoose.model("Msg");
		var msgToSort = Msg.find({_id : msgId}, function(err, msg){
			if(err)
			{console.log(err)}
			else
			{console.log(msg)}
		});
		//console.log(msgToSort);

	}

}

export = sorter;