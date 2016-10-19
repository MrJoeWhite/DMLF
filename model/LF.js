/**
 * Created by deng on 16-10-19.
 */
var upload = require('./upload');
function LF(room_id) {
    this.room_id = room_id;
    this.start()
}
module.exports = LF;
LF.prototype.start = function () {
    var roomid = this.room_id;
    var host = "";
    var token = "";
    var touristId = "";
    var options2 = {
        method: 'GET',
        url: 'http://v.laifeng.com/' + roomid + '/m'
    };
    function DMstart(body) {
        try {
            var data = JSON.parse(body);
            host = data.host;
            var values = [];
            var WebSocketClient = require('websocket').client;
            var client = new WebSocketClient();
            client.on('connectFailed', function (error) {
                console.log('Connect Error: ' + error.toString());
            });

            client.on('connect', function (connection) {
                map.set(roomid, true);
                console.log('WebSocket Client Connected');
                connection.on('error', function (error) {
                    console.log("Connection Error: " + error.toString());
                });
                connection.on('close', function () {
                    map.set(roomid, false);
                    console.log('echo-protocol Connection Closed');
                });
                connection.on('message', function (message) {
                    if (message.type === 'utf8') {
                        var utf8Data = message.utf8Data;
                        if (utf8Data.indexOf('0:::') == 0) {
                            console.log("error")
                        } else if (utf8Data.indexOf('1:::') == 0) {
                            console.log("connect");
                            setTimeout(sendData("5:::" + String(JSON.stringify({
                                    "name": "enter",
                                    "args": [{
                                        token: token,
                                        uid: touristId,
                                        roomid: roomid,
                                        endpointtype: "ct_,dt_1_1003|0|762cc02450c3470baf3f3024f488afb2_" + new Date().getTime()
                                    }]
                                }))), 1000);
                        } else if (utf8Data.indexOf('2:::') == 0) {
                            //heart beat 跟进
                            setTimeout(sendData(String('2::')), 1000);
                        } else if (utf8Data.indexOf('3:::') == 0) {
                            console.log("buqingchu")
                        } else if (utf8Data.indexOf('4:::') == 0) {
                            console.log("buqingchu")
                        } else if (utf8Data.indexOf('5:::') == 0) {
                            var data = JSON.parse(message.utf8Data.substring(4));
                            // console.log(message.utf8Data.substring(4));
                            switch (data.name) {
                                case "enterMessage":
                                case "chatMessage":
                                case "sendStar":
                                case "sendBigGift":
                                case "globalHornMessage":
                                case "sendGift":
                                {
                                    data.ctime = new Date().getTime();
                                    values.push(data);
                                    if (values.length > 20) {
                                        upload.uploadServe(roomid, 'laifeng', values);
                                        values = [];
                                    }
                                }
                                    break;
                                default:
                                    break;
                            }

                            // console.log("data");
                        }

                    }
                });
                function sendData(data) {
                    try {
                        if (connection.connected) {
                            connection.sendUTF(data);
                        }
                    } catch (e) {
                        console.log(e.message);
                    }

                }


            });
            // console.log('ws://' + host + '/socket.io/1/websocket/');
            client.connect('ws://' + host + '/socket.io/1/websocket/');
        } catch (e) {
            return console.log(e);
        }
    }
    var request = require('request');
    request(options2, function (err2, response2, body2) {
        if (err2) {
            return console.log("err2"+err2);
        }
        var str = body2.substring(body2.indexOf("<title>") + 7, body2.indexOf("<title>") + 13);
        if ("我们非常抱歉" == str) {
            return console.log(roomid + "很抱歉，您所访问的页面未能找到或出现了未知错误！");
        }

        try {
            token = response2.headers["set-cookie"]["8"].substring(4, response2.headers["set-cookie"]["8"].indexOf(";")).replace("%3D%3D", "==");
        } catch (e) {

        }
        touristId = body2.substring(body2.indexOf("touristId:'") + 11, body2.indexOf("touristId:'") + 21);
        var options1 = {
            method: 'GET',
            url: 'http://dispatcher.notify.laifeng.com/' + roomid
        };
        request(options1, function (err1, response1, body1) {
            if (err1) {
                return console.log("err1"+err1);
            }
            DMstart(body1)
        });

    });
};