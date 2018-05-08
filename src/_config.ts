
export var config: any = {}

/*{
	[key: string]: any;
} = {}*/

config.mongoURI = {
	development: "mongodb://127.0.0.1/my_db",
	test: "mongodb://127.0.0.1/ebs_test"
}

config.port = 8000

config.pam = {
	user: "pamadmin",
	password: "pamadmin",
	pamPort: 8090,
	pamWSDL: "http://sctest:8090/itpam/soap?wsdl"
}

config.pamXML = {
	checkServerStatus: ""
}


config.resend = {
	delay: 5000,
	mult: 1
}

config.requestFormName = {
	approval: "Approval"
}

config.requestFormPath = {
	approval: "/CA SLCM/SRF/"
}