
export var config: any = {}

/*{
	[key: string]: any;
} = {}*/

config.mongoURI = {
	development: "mongodb://127.0.0.1/my_db",
	test: "mongodb://127.0.0.1/ebs_test"
}

config.port = 8000