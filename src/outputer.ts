import mongoose = require("mongoose");
import { IDestinationListModel } from "./models/destinationList"
import { IMsgModel } from "./models/msg"
import { IQueueListModel } from "./models/queueList"
import { logController} from "./logger"
import repo = require("./dbRepository")
import soapout = require("./soapout")
import { config } from "./_config"
import events = require("events")

interface ICallbackB{
	( error: Error, staus:boolean ) :void
}

export class outputer{

	private queue:IQueueListModel;
	private sending:boolean;
	private numOfResends:number;

	private readonly queueId:number
	private readonly resendDelay:number;
	private readonly resendMult:number;
	private readonly resedWarning:number;

	private eventEmitter:events.EventEmitter

	constructor(id:number,emitter){
		this.queueId = id;
		this.sending = false;
		this.queue = null;

		this.resendDelay = config.resend["delay"];
		this.resendMult = config.resend["mult"];
		this.resedWarning = 0;
		this.numOfResends = 0;

		this.eventEmitter = emitter;
	}

	public startSend():void{
		var self = this;
		if(!self.sending)
		{
			self.sending = true;
			repo.queuePop(this.queueId, function(err, q:IQueueListModel){
				if(err)
					{ 
						self.sending = false;
						if(err.message == "Queue is empty")
							{ self.eventEmitter.emit("done")}
						else
							{ throw err }
					}
				else
				{
					self.queue = q;
					self.checkReceiver();
				}
			})
		}
	}

	private checkReceiver():void{
		var self = this;
		if(self.sending)
		{
			soapout.checkStatus(function(err, status){
				console.log(status)
				if(!err && status)
					{ 
						self.sendToReceiver();
					}
				else
				{
					setTimeout(function(){
						self.numOfResends = self.numOfResends + 1;
						//do stuff with resendWaring
						self.checkReceiver();
					},self.resendDelay * self.resendMult * self.numOfResends);
				}
			})
		}
	}

	private sendToReceiver():void{
		var self = this;
		var Msg = mongoose.model('Msg')
		if(self.sending)
		{
			Msg.findOne( {_id: self.queue.lastSentMsg}, function(err, message:IMsgModel){
				if(err)
				{
					self.numOfResends = 0;
					self.checkReceiver();
				}
				else
				{
					soapout.soapSend(message, function(err, status){
						if(err)
						{
							self.numOfResends = 0;
							self.checkReceiver();
						}
						else
						{	
							message.isSent = true;
							message.save(function(err){
								if(err){console.log("could not save in out");throw err}

								self.numOfResends = 0;
								self.sending = false;
								//self.eventEmitter.emit("sendNext");
								self.startSend();
							})
						}
					})
				}
			})
		}	
	}

}

