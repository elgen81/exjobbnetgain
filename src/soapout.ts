

interface ICallback{
	( error: Error, staus:boolean ) :void
}

export function checkStatus(cb?:ICallback): void{
	if(!cb) {cb = function(){}}

	setTimeout(()=>{
	var status = Math.random()*10;
	console.log(status);

	if(status > 1)
		{
			console.log("Server OK");
			cb(null, true)
		}
	else
		{
			var err = new Error("Server not OK");
			console.log(err)
			cb(err, false)
		}	
	},10000)
}

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