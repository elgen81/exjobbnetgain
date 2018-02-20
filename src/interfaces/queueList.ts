//inteface for destinationList.ts

import mongoose = require("mongoose");
import IDestinationList = require("../interfaces/destinationList");
import IMsg = require("../interfaces/msg");


interface IQueueList{
	queueId: mongoose.Schema.Types.ObjectId,
	msgArray: mongoose.Schema.Types.ObjectId[],
	lengthOfQueue: number
};

export = IQueueList;