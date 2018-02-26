//whitelistDb.ts

import mongoose = require("mongoose");
import IMsg = require("../interfaces/msg");
import * as DestinationList from "./destinationList";



export interface IMsgModel extends IMsg, mongoose.Document{
	//Place for custom methods
};

export var msgSchema: mongoose.Schema = new mongoose.Schema({
	queueId: Number, //{ type: mongoose.Schema.Types.ObjectId, ref: "destinationList" },
	sender: String,
	reciver: String,
	isSent: Boolean,
	isSorted: Boolean,
	timeRecived: Date,
	timeSent: Date,
	msg: String
});

export var Msg = mongoose.model<IMsgModel>("Msg", msgSchema);
//export = Msg;