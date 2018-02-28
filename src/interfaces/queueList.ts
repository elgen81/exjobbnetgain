//inteface for destinationList.ts

import mongoose = require("mongoose");
import IDestinationList = require("../interfaces/destinationList");
import IMsg = require("../interfaces/msg");


interface IQueueList{
	queueId: number, //mongoose.Schema.Types.ObjectId,
	lengthOfQueue: number,
	lastSentMsg: mongoose.Schema.Types.ObjectId,
	timeOfLastSent: Date,
	msgArray: mongoose.Schema.Types.ObjectId[]
};

export = IQueueList;