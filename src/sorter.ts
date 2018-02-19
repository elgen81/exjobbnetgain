import mongoose = require("mongoose");

class sorter{

	static sortElem(msgId:string):void {
			console.log("In sorter");
			console.log("msgId = " + msgId);
			var Msg = mongoose.model("Msg");

			Msg.find({_id : msgId}, function(err, msg){
				if(err)
				{console.log(err)}
				else
				{console.log(msg)}
			});
		}

}

export = sorter;