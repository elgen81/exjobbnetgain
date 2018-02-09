//whitelistDb.ts

import mongoose = require("mongoose");
import IDestinationList = require("../interfaces/destinationList");

interface IDestinationListModel extends IDestinationList, mongoose.Document{
	//Place for custom methods
}

var destinationListSchema: mongoose.Schema = new mongoose.Schema({
	queueID: Number,
	destination: String
});

var DestinationList = mongoose.model<IDestinaionList>("DestinationList", destinationListSchema);

export = DestinaionList;