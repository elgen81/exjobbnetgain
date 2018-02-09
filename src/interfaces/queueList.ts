//inteface for destinationList.ts

import mongoose = require("mongoose");
import IDestinationList = require("../interfaces/destinationList");
import IMsg = require("../interfaces/msg");


interface IQueueList{
	queueID: IDestinationList,
	msgArray: IMsg[]
};

export = IQueueList;