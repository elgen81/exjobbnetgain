import soap = require("soap");
import { IMsgModel } from "./models/msg"
import { config } from "./_config";

interface ICallback{
	( error: Error, staus:boolean ) :void
}


export function soapSend(message:IMsgModel, cb?:ICallback):void{
	if(!cb) {cb = function(){}}

	var auth = "Basic " + new Buffer("pamadmin" + ":" + "pamadmin").toString("base64");
	var self = this;
	var args = { auth:{user: "pamadmin", password: "pamadmin"}, 
				objLocation: { name: config.requestFormName["approval"], path: config.requestFormPath["approval"] }, 
				params: 'replace' }

	var timeOut = setTimeout(function(){ cb(new Error("Could not reach server"), false) }, 30000);
		console.log("pre-soap call")
		soap.createClient("http://10.126.172.17:8090/itpam/soap?wsdl", (err, client:any) =>{
			
			clearTimeout(self.timeOut);
			console.log("sendingclient created")
			if(err)
				{ cb(err, false) }
			else if(!client)
				{ cb(new Error("Client not created"), false)}
			else
			{
				client.executeStartRequest(args, function(err, result, rawRes, soapHeader, rawReq){
					console.log("in sending soapcall calback")
					if (err)
						{ cb(err, false) }
					else if(!result)
						{ cb(new Error("No response from server"), false) }
					else
					{	console.log(result)
						cb(null, true)
					}
				}, {postProcess: function(_xml) {
					return _xml.replace('replace', '<param name="RequestID">' + message.msg["request_id"] + '</param> <param name="RequestItemID">' + message.msg["request_item_id"] + '</param>')
				}})
			}
		})
}




/*checserver working version*/
//http://10.126.172.17:8090/itpam/soap?wsdl
export function checkStatus(cb?:ICallback): void{
	if(!cb) {cb = function(){}}
	var self = this;
	var auth = "Basic " + new Buffer("pamadmin" + ":" + "pamadmin").toString("base64");
	var args = { auth:{user: "pamadmin", password: "pamadmin"}}
	
	var timeOut = setTimeout(function(){ cb(new Error("Could not reach server"), false) }, 30000);
	
		console.log("pre-soap call")
		soap.createClient("http://10.126.172.17:8090/itpam/soap?wsdl", (err, client:any) =>{
			
			clearTimeout(self.timeOut);
			console.log("client created")
			if(err)
				{ cb(err, false) }
			else if(!client)
				{ cb(new Error("Client not created"), false)}
			else
			{
				client.checkServerStatus(args, function(err, result, rawRes, soapHeader, rawReq){
					console.log("soapcall calback")
					if (err)
						{ cb(err, false) }
					else if(!result)
						{ cb(new Error("No response from server"), false) }
					else
					{
						cb(null, result.serverStatus == "Server status ok.")
					}
				})
			}
		})
}

