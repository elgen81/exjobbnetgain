import mongoose = require("mongoose");
import repo = require("./dbRepository");
import { IMsgModel} from "./models/msg"

class sorter{

	static sortElem(msgId:string):boolean {
			console.log("In sorter");
			console.log("msgId = " + msgId);
			var Msg = mongoose.model("Msg");
			var retvalue:boolean = false;


			Msg.findById(msgId, function(err, msg:IMsgModel){

				console.log(msg);
				if(err){
					retvalue = false;
				}
				else{
					if(msg){
						repo.queuePush(msg.queueId, msgId);
						msg.update({ sorted : true});
						console.log(msg)
						retvalue = true;
					}
					else{
						retvalue = false;
					}
				}
			})
			return retvalue;
		}

}

export = sorter;