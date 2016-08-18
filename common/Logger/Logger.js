var winston = require('winston');
var path = require('path');
require('winston-daily-rotate-file');
require('./MysqlLogger');

winston.remove(winston.transports.Console);
var metaFormat = function (meta) {
    var str = "";
    str += meta.location + " ";
    delete meta.date;
    delete meta.location;
    var message = meta.message;
    if(typeof message === 'string' && meta.method == undefined){
        str += "[" + message + "]";
    } else if (typeof message === 'object' && meta.method == undefined){
        delete message.date;
        for(var key in message){
            str += "[" + key + ":" + message[key] + "]"
        }
    } else if (meta.method != undefined){
        for(var key in meta){
            str += "[" + key + ":" + meta[key] + "]"
        }
    }
    return str;
};

var formatter = function(args){
    var date = (new Date()).format('yyyy-mm-dd HH:MM:ss'),
        level = args.level,
        message = args.message,
        meta = args.meta;
    return date + " " + level.toUpperCase() + " " + metaFormat(meta);
};

winston.add(winston.transports.Console, {
    formatter: formatter
});
winston.add(winston.transports.DailyRotateFile, {
    name: 'file',
    datePattern: '.yyyy-MM-dd',
    formatter: formatter,
    filename: path.join("logs", "gdas_wechat"),
    json: false
});
winston.add(winston.transports.MysqlLogger);

var logger = winston,
    requestData = require('./RequestData');

module.exports.log = function (message) {
    log("info", _getCallerFile(), message);
};

module.exports.info = function (message) {
    log("info", _getCallerFile(), message);
};

module.exports.error = function (message) {
    log("error", _getCallerFile(), message);
};

module.exports.warn = function (message) {
    log("warn", _getCallerFile(), message);
};

function log(level, location, message){
    if(message.hasOwnProperty('originalUrl')){
        //message 是 request 对象
        message = requestData.getData(message);
    }
    logger.log(level, {
        location: location,
        message: message
    })
}

function _getCallerFile() {
    try {
        var err = new Error();
        var callerfile;
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) return callerfile.slice(callerfile.lastIndexOf("\\")+1);
        }
    } catch (err) {}
    return undefined;
}

module.exports.winston = winston;