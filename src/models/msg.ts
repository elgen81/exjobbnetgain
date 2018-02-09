//whitelistDb.ts

import mongoose = require("mongoose");
import IMsg = require("../interfaces/msg");


interface IMsgModel extends IMsg, mongoose.Document{
	//Place for custom methods
};

var msgSchema: mongoose.Schema = new mongoose.Schema({
	queueId: { type: mongoose.Schema.Types.ObjectId, ref: "destinationList" },
	sender: String,
	reciver: String,
	isSent: Boolean,
	timeRecived: Date,
	timeSent: Date,
	msg: String
});

var Msg = mongoose.model<IMsgModel>("Msg", msgSchema);
export = Msg;