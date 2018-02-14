//whitelistDb.ts

import mongoose = require("mongoose");
import IDestinationList = require("../interfaces/destinationList");

interface IDestinationListModel extends IDestinationList, mongoose.Document{
	//Place for custom methods
}

export var destinationListSchema: mongoose.Schema = new mongoose.Schema({
	queueID: Number,
	destination: String,
	active: Boolean
});

export var DestinationList = mongoose.model<IDestinationListModel>("DestinationList", destinationListSchema);

//export = DestinationList;