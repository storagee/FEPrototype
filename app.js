var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./app_server/routes/index');
var users = require('./app_server/routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/users', users);

// var wechat = require('wechat');
// var config = {
//     token: 'gzlaizhihui',
//     appid: 'wx21b59f332643015c'
// };
// app.use(express.query());
// app.use('/', wechat(config, function (req, res, next) {
//     var message = req.weixin;
//     if(message.Content == 'now'){
//         res.reply(Date.now());
//     }else{
//         res.reply([
//             {
//                 title: '你来我家接我吧',
//                 description: '这是女神与高富帅之间的对话',
//                 picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
//                 url: 'http://nodeapi.cloudfoundry.com/'
//             }
//         ]);
//     }
// }));

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




module.exports = app;
