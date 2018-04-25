import soap = require("soap");


interface ICallback{
	( error: Error, staus:boolean ) :void
}

/*
function _checkStatus(_cb:ICallback){
		console.log("pre-soap call")
		var args = { auth:{user: "pamadmin", password: "pamadmin"}}
		var timer = setTimeout(_checkStatus(_cb), 30000);
		soap.createClient("http://10.126.172.17:8090/itpam/soap?wsdl", (err, client:any) =>{
			//client.setSecurity(new soap.BasicAuthSecurity("pamadmin", "pamadmin"));
			clearTimeout(timer);
			console.log("client created")
			if(err)
				{ _cb(err, false) }
			else if(!client)
				{ _cb(new Error("Client not created"), false)}

			client.checkServerStatus(args, function(er, result, rawRes, soapHeader, rawReq){
				console.log("soapcall calback")
				if (err)
					{ _cb(err, false) }
				else if(!result)
					{ _cb(new Error("No response from server"), false) }
				else
				{
					_cb(null, result.serverStatus == "Server status ok.")
				}
			})
		})
	}

export function checkStatus(cb?:ICallback): void{
	if(!cb) {cb = function(){}}

	var auth = "Basic " + new Buffer("pamadmin" + ":" + "pamadmin").toString("base64");
	console.log("pre first check call")

	_checkStatus(cb);
}
*/
export function soapSend(msg:string, cb?:ICallback):void{
	
	setTimeout(()=>{
		var status = Math.random()*10;
	
	if(status > 1)
		{
			console.log(msg);
			cb(null, true)
		}
	else
		{
			var err = new Error("Failed to send");
			console.log(err)
			cb(err, false)
		}

	},10000)
	
}




/*checserver working version*/
//http://10.126.172.17:8090/itpam/soap?wsdl
export function checkStatus(cb?:ICallback): void{
	if(!cb) {cb = function(){}}

	var auth = "Basic " + new Buffer("pamadmin" + ":" + "pamadmin").toString("base64");
	var args = { auth:{user: "pamadmin", password: "pamadmin"}}
	
	//var timer = setInterval(function(){
		console.log("pre-soap call")
		soap.createClient("http://10.126.172.17:8090/itpam/soap?wsdl", (err, client:any) =>{
			//client.setSecurity(new soap.BasicAuthSecurity("pamadmin", "pamadmin"));
			//clearInterval(timer);
			console.log("client created")
			if(err)
				{ cb(err, false) }
			else if(!client)
				{ cb(new Error("Client not created"), false)}
			else
			{
				client.checkServerStatus(args, function(er, result, rawRes, soapHeader, rawReq){
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
	//}, 30000)
}

