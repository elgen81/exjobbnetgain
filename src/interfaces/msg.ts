//inteface for destinationList.ts

import mongoose = require("mongoose");
import IDestinationList = require("../interfaces/destinationList");

interface IMsg{
	queueId: IDestinationList,
	sender: string,
	reciver: string,
	isSent: boolean,
	timeRecived: Date,
	timeSent: Date,
	msg: string
};

export = IMsg;