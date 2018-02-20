//inteface for destinationList.ts

import mongoose = require("mongoose");
import IDestinationList = require("../interfaces/destinationList");

interface IMsg{
	queueId: mongoose.Schema.Types.ObjectId, //IDestinationList,
	sender: string,
	reciver: string,
	isSent: boolean,
	isSorted: boolean,
	timeRecived: Date,
	timeSent: Date,
	msg: string
};

export = IMsg;