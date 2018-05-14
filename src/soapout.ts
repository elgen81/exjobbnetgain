import soap = require("soap");
import { IMsgModel } from "./models/msg"
import { config } from "./_config";

interface ICallback{
	( error: Error, staus:boolean ) :void
}


export function soapSend(message:IMsgModel, cb?:ICallback):void{
	if(!cb) {cb = function(){}}

	var self = this;
	var args = { auth:{user: "pamadmin", password: "pamadmin"}, 
				objLocation: { name: config.requestFormName["approval"], path: config.requestFormPath["approval"] }, 
				params: 'replace' }

	//This timeout ensures that the module does not freeze if the wsdl server is unavalible
	var timeOut = setTimeout(function(){ cb(new Error("Could not reach server"), false) }, 30000);
		soap.createClient(config.pam["pamWSDL"], (err, client:any) =>{
			
			clearTimeout(self.timeOut);
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


export function checkStatus(cb?:ICallback): void{
	if(!cb) {cb = function(){}}

	var self = this;
	var args = { auth:{user: "pamadmin", password: "pamadmin"}}
	
	//This timeout ensures that the module does not freeze if the wsdl server is unavalible
	var timeOut = setTimeout(function(){ cb(new Error("Could not reach server"), false) }, 30000);
		soap.createClient(config.pam["pamWSDL"], (err, client:any) =>{
			
			clearTimeout(self.timeOut);
			if(err)
				{ cb(err, false) }
			else if(!client)
				{ cb(new Error("Client not created"), false)}
			else
			{
				client.checkServerStatus(args, function(err, result, rawRes, soapHeader, rawReq){
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


/*
export function templateSoapCall(..., cb?:ICallback):void{
	if(!cb) {cb = function(){}}

	var self = this;
	var args = { "Arguments fpr the soap call" }

	//This timeout ensures that the module does not freeze if the wsdl server is unavalible
	var timeOut = setTimeout(function(){ cb(new Error("Could not reach server"), false) }, 30000);
		console.log("pre-soap call")
		soap.createClient("URI for WSDL-file", (err, client:any) =>{
			
			clearTimeout(self.timeOut);
			if(err)
				{ cb(err, false) }
			else if(!client)
				{ cb(new Error("Client not created"), false)}
			else
			{
				client.SoapCallToExec(args, function(err, result, rawRes, soapHeader, rawReq){
					
					...

				}, {postProcess: function(_xml) {
					
					used if anything needs to be done to the xml-coad before sending it to the server

				}})
			}
		})
}*/