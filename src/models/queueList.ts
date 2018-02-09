//whitelistDb.ts

import mongoose = require("mongoose");
import IQueueList = require("../interfaces/queueList");

interface IQueueListModel extends IQueueList, mongoose.Document{
	//Place for custom methods
};

var queueListSchema: mongoose.Schema = new mongoose.Schema({
	queueID: { type: mongoose.Schema.Types.ObjectId, ref: "destinationList" },
	msgArray: [{ type: mongoose.Schema.Types.ObjectId, ref: "msg" }]
});

var QueueList = mongoose.model<IQueueListModel>("QueueList", queueListSchema);

export = QueueList;