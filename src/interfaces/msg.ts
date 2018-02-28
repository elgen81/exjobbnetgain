//inteface for destinationList.ts

import mongoose = require("mongoose");
import IDestinationList = require("../interfaces/destinationList");

interface IMsg{
	queueId: number,//mongoose.Schema.Types.ObjectId, //IDestinationList,
	sender: string,
	receiver: string,
	isSent: boolean,
	isSorted: boolean,
	timeReceived: Date,
	timeSent: Date,
	msg: string
};

export = IMsg;