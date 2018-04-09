var axios_1 = require("axios");
var _config_1 = require("./../dist/_config");
var mongoose = require("mongoose");
var logController = require("./../dist/logger");
var uri = "mongodb://127.0.0.1/my_db";
function statusS() {
    axios_1["default"].get('http://127.0.0.1:' + _config_1.config.port + '/menu/getStatus').then(function (res) {
        if (res.status == 200) {
            switch (res.data.DBStatus) {
                case 0:
                    document.getElementById("statusS").innerHTML = "Server status: Disconnected";
                    document.getElementById("statusS").style.color = "red";
                    break;
                case 1:
                    document.getElementById("statusS").innerHTML = "Server status: Connected";
                    document.getElementById("statusS").style.color = "green";
                    break;
                case 2:
                    document.getElementById("statusS").innerHTML = "Server status: Connecting";
                    document.getElementById("statusS").style.color = "yellow";
                    break;
                case 3:
                    document.getElementById("statusS").innerHTML = "Server status: Disconnecting";
                    document.getElementById("statusS").style.color = "yellow";
                    break;
                default:
                    document.getElementById("statusS").innerHTML = "Server status: Error";
                    document.getElementById("statusS").style.color = "red";
                    break;
            }
        }
        else {
            document.getElementById("statusS").innerHTML = "Server status: Error";
            document.getElementById("statusS").style.color = "red";
        }
    })["catch"](function (err) {
        document.getElementById("statusS").innerHTML = "Server status: Server Not Found";
        document.getElementById("statusS").style.color = "red";
    });
}
function statusQ() {
    mongoose.connect(uri, function (err) {
        if (err) {
            logController(process.argv[1], err, "error", process.argv[2]);
        }
    });
    require("./../dist/models/queueList");
    var QueueList = mongoose.model("QueueList");
    QueueList.find({
        lengthOfQueue: { $gt: 0 }
    }).count(function (err, count) {
        if (err) {
            logController(process.argv[1], err, "error", process.argv[2]);
        }
        else {
            document.getElementById("statusQ").innerHTML = "Active Queues : " + count;
        }
        mongoose.connection.close();
    });
}
function statusP() {
    mongoose.connect(uri, function (err) {
        if (err) {
            logController(process.argv[1], err, "error", process.argv[2]);
        }
    });
    require("./../dist/models/msg");
    var Msg = mongoose.model("Msg");
    Msg.find({
        isSorted: true,
        isSent: false
    }).count(function (err, count) {
        if (err) {
            logController(process.argv[1], err, "error", process.argv[2]);
        }
        else {
            document.getElementById("statusP").innerHTML = "Packages in Queues : " + count;
        }
        mongoose.connection.close();
    });
}
