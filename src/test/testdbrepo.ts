import assert = require('assert');
import * as file from './../dbRepository'
import {config} from "./../_config";
import {destinationListSetup, queuePush, queuePop, activeMsg, activeQueues, listActive} from './../dbRepository';
import * as mongoose from "mongoose";
import { DestinationList } from '../models/destinationList';
import {fillData} from '../test/testfile'
import { Msg, IMsgModel } from '../models/msg';
import { queue } from 'async';
import { IQueueListModel } from '../models/queueList';
import { RSA_PKCS1_OAEP_PADDING } from 'constants';

interface ICallback{
    (error:Error, status:boolean) : void
}

function setup(callback?:ICallback){
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
    mongoose.connection.dropDatabase(function(err){
        if(!err){
            mongoose.connection.close(function(err){
                if(err){
                    callback(err,false)
                }
                callback(null,true)
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
                                    assert.equal(queue.msgArray[0].toString,msg._id.toString)
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
                    var msgIn:mongoose.Document = new Msg({
                    });
                    msgIn.save(function(err,msg:IMsgModel){
                        destinationListSetup("test.ini",function(err,status){
                            queuePush(1,msg._id,function(err,status){
                                assert.equal(err, null)
                                assert.equal(status,true)
                                queues.findOne({queueId: 1}, function(err, queue:IQueueListModel){
                                    assert.equal(queue.msgArray[0].toString,msg._id.toString)
                                    assert.equal(queue.lengthOfQueue,1)
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
   /* 3 meddelanden i kön, 
    spara 1a elementet
    längden på kön
    poppa 
    kolla längden -1 på
    array.length och lengthofqueue
    lastmessage sent = 1a Element
    poppa
    skall vara lika som tidigare
    sätt issent på meddelandet som ligger i lastmessagesent
    poppa
    minskar array och lastmessage*/