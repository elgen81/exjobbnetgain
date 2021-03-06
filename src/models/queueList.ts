//whitelistDb.ts

import mongoose = require("mongoose");
import IQueueList = require("../interfaces/queueList");

export interface IQueueListModel extends IQueueList, mongoose.Document{
	//Place for custom methods
};

export var queueListSchema: mongoose.Schema = new mongoose.Schema({
	queueId: Number, //{ type: mongoose.Schema.Types.ObjectId, ref: "destinationList" },
	lengthOfQueue: Number,
	lastSentMsg: { type: mongoose.Schema.Types.ObjectId, ref: "msg" },
	timeOfLastSent: Date,
	msgArray: [{ type: mongoose.Schema.Types.ObjectId, ref: "msg" }]
});

export var QueueList = mongoose.model<IQueueListModel>("QueueList", queueListSchema);

//export = QueueList;