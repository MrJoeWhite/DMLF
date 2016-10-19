var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/GHR', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var GHR = require("./model/getHotRoom");
var LF = require("./model/LF");
var HashMap = require("hashmap").HashMap;
map = new HashMap();
function getroom(i) {
    GHR.getRoomUsers("http://www.laifeng.com/center?pageNo="+i, function (err, usersList) {
        if (err) {
            return console.log(err);
        }
        // console.log(usersList);
        var i = 0;
        var timer = setInterval(function () {
            if (i >= 120) {
                timer.clearInterval(timer);
            }
            var roomid = usersList[i].attribs.href.substring("http://v.laifeng.com/".length);
            if(!map.get(roomid)){
                new LF(roomid);
            }
            // console.log(href);
            i++;
        }, 5000);
    });
}

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
var time = [];
for (var i = 0; i < 60; i += 15) {
    time.push(i);
}
schedule.scheduleJob(rule, function () {
    getroom(1);
    // getroom(2);

});
getroom(1);
// getroom(2);
module.exports = app;
