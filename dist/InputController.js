"use strict";
//UserController.ts
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var Msg = require("./models/msg");
router.use(bodyParser.urlencoded({ extended: true }));
//router.use(bodyParser.json());
router.post('/', function (req, res) {
    /*var msg:string = req.body.reciver + req.body.msg;
    console.log(msg);
    console.log(req.body.reciver);
    console.log(req.body.msg);
    res.status(200).send(msg);*/
    var msgIn = new Msg({
        sender: req.connection.remoteAddress,
        reciver: req.body.reciver,
        msg: req.body.msg
    });
    console.log(req.body.reciver);
    console.log(req.body.msg);
    console.log(msgIn);
    msgIn.save();
    res.send("hello wolrd!");
    //if(err) {return res.status(500).send("There was a problem adding the information to the database.");}
    //res.status(200).send(msg);
    //});
});
router.get('/', function (req, res) {
    var query = Msg.find(); /*, function(err, msg){
        if(err) {return res.status(500).send("There was a problem finding the users.");}
        res.status(200).send(msg);
    });*/
    console.log(query.cast(Msg));
    res.send(query.cast(Msg));
});
module.exports = router;
