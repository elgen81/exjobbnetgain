"use strict";
//whitelistDb.ts
var mongoose = require("mongoose");
;
var msgSchema = new mongoose.Schema({
    queueId: { type: mongoose.Schema.Types.ObjectId, ref: "destinationList" },
    sender: String,
    reciver: String,
    isSent: Boolean,
    timeRecived: Date,
    timeSent: Date,
    msg: String
});
var Msg = mongoose.model("Msg", msgSchema);
module.exports = Msg;
