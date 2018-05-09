import assert = require('assert');
import * as file from './../dbRepository'
import {config} from "./../_config";
import {destinationListSetup, queuePush, queuePop, activeMsg, activeQueues, listActive} from './../dbRepository';
import * as mongoose from "mongoose";
import { DestinationList } from '../models/destinationList';
import {fillData} from '../test/file.test'
import { Msg, IMsgModel } from '../models/msg';
import { queue } from 'async';
import { IQueueListModel } from '../models/queueList';
import { RSA_PKCS1_OAEP_PADDING } from 'constants';

interface ICallback{
    (error:Error, status:boolean) : void
}

function setup(callback?:ICallback){
    if(!callback){callback = function(){}};
    mongoose.connect(config.mongoURI["test"], function(err){
        if(err){
            callback(err,false)
        }
        else{
        require("./../models/destinationList");
        require("./../models/msg");
        require("./../models/queueList");
        callback(null,true)
        }
    })
    

}

function tear(callback?:ICallback){
    if(!callback){callback = function(){}};
    mongoose.connection.dropDatabase(function(err){
        if(!err){
            mongoose.connection.close(function(err){
                if(err){
                    callback(err,false)
                }
                else{
                    callback(null,true)
                }
            });
        }
        else{
            callback(err,false)
        }
    });
}

describe('Setup/tear',function(){
    describe('Setting up testdata and then tear it',function(){
        it('starts server and attatch models',function(done){
            setup(function(err,status){
                assert.equal(err, null);
                assert.equal(status,true)
                tear(function(err,status){
                    assert.equal(err, null)
                    assert.equal(status,true)
                    done()
                })
            })
        })
    })
})

describe('dbrepository, all functions related to the database',function(){
    describe('destinationSetup(), adds to database ',function(){
        it('fillData(false,false), returns fail as there is no file present',function(done){
            fillData(false,false,function(err,data){
                setup(function(){
                    destinationListSetup("test.ini",function(err,status){
                        assert.equal(err,'Error: test.ini does not exist')
                        assert.equal(status,false)
                        tear(function(err,data){
                            done()
                        })
                    })
                })
            })
        })

        it('fillData(true,false), returns fail as there is no data in the file',function(done){
            fillData(true,false,function(err,data){
                setup(function(){
                    destinationListSetup("test.ini",function(err,status){
                        assert.equal(err,'Error: File is empty')
                        assert.equal(status,false)
                        tear(function(err,data){
                            done()
                        })
                    })
                })
            })
        })

        it('fillData(true,true), adds file to the database from the a list',function(done){
            fillData(true,true,function(err,data){
                setup(function(){
                    destinationListSetup("test.ini",function(err,status){
                        assert.equal(err,null)
                        assert.equal(status,true)
                        tear(function(err,data){
                            done()
                        })
                    })
                })
            })
        })
    })

    describe('queuePush(), adds message to databasequeue',function(){
        it('creates a new queue with a new message',function(done){
            fillData(true,true,function(err,data){
                setup(function(){
                    var queues = mongoose.model("QueueList")
                    var msgs = mongoose.model("Msg")
                    var msgIn:mongoose.Document = new Msg({
                    });
                    msgIn.save(function(err,msg:IMsgModel){
                        destinationListSetup("test.ini",function(err,status){
                            queuePush(1,msg._id,function(err,status){
                                assert.equal(err, null)
                                assert.equal(status,true)
                                queues.findOne({queueId: 1}, function(err, queue:IQueueListModel){
                                    assert.equal(queue.msgArray[0].toString(),msg._id.toString())
                                    assert.equal(queue.lengthOfQueue,1)
                                    done()
                                })
                            })
                        })
                    })
                })
            })
        })
        it('Push a message to an already created queue',function(done){
            var queues = mongoose.model("QueueList")
            var msgs = mongoose.model("Msg")
            var msgIn:mongoose.Document = new Msg({
            });
            msgIn.save(function(err,msg:IMsgModel){
                queuePush(1,msg._id,function(err,status){
                    assert.equal(err, null)
                    assert.equal(status,true)
                    queues.findOne({queueId: 1}, function(err, queue:IQueueListModel){
                        assert.equal(queue.msgArray[1].toString,msg._id.toString)
                        assert.equal(queue.lengthOfQueue,2)
                        tear(function(err,status){
                            done()
                        })
                    })
                })
            })
        })
    })
    describe('queuePop moves an element from queue to sent',function(){
        it("should pop a message to sent",function(done){
            fillData(true,true,function(err,data){
                setup(function(){
                    var queues = mongoose.model("QueueList")
                    var msgs = mongoose.model("Msg")
                    var message = [new Msg(),new Msg(),new Msg()]
                    Msg.collection.insertMany(message,function(err,messages){
                        destinationListSetup("test.ini",function(err,status){
                            queuePush(1,message[0]._id, function(err,status){
                                queuePush(1,message[1]._id, function(err,status){
                                    queuePush(1,message[2]._id, function(err,status){    
                                        queues.findOne({queueId: 1}, function(err, queue:IQueueListModel){
                                            queue.lengthOfQueue=queue.msgArray.length
                                            queue.save(function(err,queue){
                                                queuePop(1,function(err,queue){
                                                    assert.equal(queue.msgArray[0].toString(),message[1]._id.toString())
                                                    assert.equal(queue.lengthOfQueue,2)
                                                    assert.equal(queue.lastSentMsg.toString(),message[0]._id.toString())
                                                    queuePop(1,function(err,queue){
                                                        assert.equal(queue.msgArray[0].toString(),message[1]._id.toString())
                                                        assert.equal(queue.lengthOfQueue,2)
                                                        assert.equal(queue.lastSentMsg.toString(),message[0]._id.toString())
                                                        Msg.findOne({_id: queue.lastSentMsg},function(err,res){
                                                            res.isSent=true;
                                                            res.save(function(err,product){
                                                                queuePop(1,function(err,queue){
                                                                    assert.equal(queue.msgArray[0].toString(),message[2]._id.toString())
                                                                    assert.equal(queue.lengthOfQueue,1)
                                                                    assert.equal(queue.lastSentMsg.toString(),message[1]._id.toString())
                                                                    tear(function(){
                                                                        done()
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            }) 
                        })
                    })
                })
            })
        })
    })
    describe('activeMsg, retrieves how many messages are active',function(){
        it("should return the numbers of messages that are sorted but not sent",function(done){
            fillData(true,true,function(err,data){
                setup(function(){
                    var queues = mongoose.model("QueueList")
                    var msgs = mongoose.model("Msg")
                    activeMsg(function(err,data){
                        assert.equal(data,0)
                        var message = [{isSorted:true,isSent:false},{isSorted:true,isSent:true},{isSorted:false,isSent:false},{isSorted:false,isSent:true}]
                        msgs.insertMany(message,function(err,messages){
                            destinationListSetup("test.ini",function(err,status){
                                activeMsg(function(err,data){
                                    assert.equal(err,null)
                                    assert.equal(data,1)
                                    tear(function(){
                                        done()
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
    describe('activeMsg, retrieves how many messages are active',function(){
        it("should return the numbers of messages that are sorted but not sent",function(done){
            fillData(true,true,function(err,data){
                setup(function(){
                    var queues = mongoose.model("QueueList")
                    var msgs = mongoose.model("Msg")
                    var message = [{queueId: 1, sender: "www.test.com", receiver: "www.test1.com", timeReceived: new Date() ,isSorted:true,isSent:false},{queueId: 2, sender: "www.test2.com", receiver: "www.test3.com", timeReceived: new Date(), isSorted:true,isSent:true},{queueId: 3, sender: "www.test4.com", receiver: "www.test5.com", timeReceived: new Date(),isSorted:false,isSent:false},{queueId: 4, sender: "www.test6.com", receiver: "www.test7.com", timeReceived: new Date(),isSorted:false,isSent:true}]
                    msgs.insertMany(message,function(err,messages){
                        destinationListSetup("test.ini",function(err,status){
                            listActive(function(err,data){
                                assert.equal(err,null)
                                assert.equal(data[0].queueId,message[0].queueId)
                                assert.equal(data[0].sender,message[0].sender)
                                assert.equal(data[0].receiver,message[0].receiver)
                                assert.equal(data[0].timeReceived.toString(),message[0].timeReceived.toString())
                                tear(function(){
                                    done()
                                })
                            })
                        })
                    })
                })
            })
        })
    })
    describe('activeQueues, retrieves how many queues are active',function(){
        it("should return the numbers of queues that has messages in them",function(done){
            fillData(true,true,function(err,data){
                setup(function(){
                    var queues = mongoose.model("QueueList")
                    var msgs = mongoose.model("Msg")
                    activeQueues(function(err,data){
                        assert.equal(data,0)
                        var queue = [{lengthOfQueue:1},{lengthOfQueue:0},{lengthOfQueue:-1}]
                        queues.insertMany(queue,function(err,queueus){
                            destinationListSetup("test.ini",function(err,status){
                                activeQueues(function(err,data){
                                    assert.equal(err,null)
                                    assert.equal(data,1)
                                    tear(function(){
                                        done()
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})