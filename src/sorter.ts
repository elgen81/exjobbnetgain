import mongoose = require("mongoose");
import repo = require("./dbRepository");
import { IMsgModel} from "./models/msg"

interface ICallback{
	( error: Error, staus:boolean ) :void
}
class sorter{

	static sortElem(msgId:string, callback?: ICallback):void{
			console.log("In sorter");
			console.log("msgId = " + msgId);
			var Msg = mongoose.model("Msg");
			var retvalue:boolean = false;
			if(!callback){callback = function(){}}

			Msg.findById(msgId, function(err, msg:IMsgModel){

				console.log(msg);
				if(err){
					callback(err, false);
				}
				else{
					if(msg){
						repo.queuePush(msg.queueId, msgId,function(err, status){
							if(err){callback(err, false)}
							else{
							msg.update({ isSorted : true}, function(err){
								if(err){callback(err, false)}
								else{
									console.log(msg)
									callback(null, true);
								}
							});
							}	
						});						
					}
					else{
						callback(new Error("Message not found"), false);
					}
				}
			})
		}

}

export = sorter;