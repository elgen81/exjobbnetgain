//User.ts

import * as mongoose from "mongoose";
var UserSchema = new mongoose.Schema({
						name: String,
						email: String,
						password: String
						});

mongoose.model("User", UserSchema);

export = mongoose.model("User");