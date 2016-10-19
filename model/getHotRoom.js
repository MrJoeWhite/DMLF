/**
 * Created by deng on 16-10-19.
 */
var request = require("request");
var cheerio = require("cheerio");
exports.getRoomUsers=function (url,callback) {
    url = "http://www.laifeng.com/center?pageNo=1";
    request(url, function (error, response, body) {
        if (error) return callback(error);
        var $ = cheerio.load(body);
        var users = $(".user-list li .name a ").toArray();
        callback(null,users);
        // console.log(GHR);
    });
};

