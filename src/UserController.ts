//UserController.ts

import express = require("express");
var router = express.Router();
import bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());

import User = require("./User");

console.log("in usercontroller");

router.post('/', function(req, res){
	User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	},
	function(err, user){
		if(err) {return res.status(500).send("There was a problem adding the information to the database.");}
		res.status(200).send(user);
	});
});

router.get('/', function(req, res){
	User.find({}, function(err, users){
		if(err) {return res.status(500).send("There was a problem finding the users.");}
		res.status(200).send(users);
	});
});

export = router;