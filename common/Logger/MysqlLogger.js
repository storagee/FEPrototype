var util = require("util"),
    winston = require("winston"),
    mysql = require("mysql"),
    options = null;

var MysqlLogger = winston.transports.MysqlLogger = function () {
    //详情请查阅：https://github.com/winstonjs/winston#filters-and-rewriters

    options = {
            connectionLimit: 10,
            host: '192.168.228.187',
            user: 'us_gdas',
            password: 'mhZp3pazdT3scFKI',
            database: 'gdas',
            charset: 'utf8'
        };

    //Only user/database/table are required
    if (!options.database)
        throw new Error('The database name is required');

    // if (!options.table)
    //     throw new Error('The table name is required');

    if (!options.user)
        throw new Error('User is required');

    // Connection pool for a MysqlServer
    this.pool = mysql.createPool(options);

    //命名
    this.name = 'mysqlLogger';

    this.level = options.level || 'info';
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(MysqlLogger, winston.Transport);

MysqlLogger.prototype.log = function (level, msg, meta, callback) {
    //
    // Store this message and metadata, maybe use some custom logic
    // then callback indicating success.
    //
    delete meta.date;
    var location = "";
    var message = "";
    if(meta.hasOwnProperty('location')){
        location = meta.location;
        delete meta.location;
    }
    if(meta.hasOwnProperty('message') && !meta.hasOwnProperty('openId')){
        if(typeof meta.message === 'string'){
            message = meta.message;
        }else if(typeof meta.message === 'object'){
            message = ObjStringify(meta.message);
        }
    }else if(meta.hasOwnProperty('openId')){
        message = ObjStringify(meta);
    }

    location = location.replace(/[\\\']/g, '\\$&');
    message = message.replace(/[\\"']/g, '\\$&');

    this.pool.getConnection(function (err, connection) {
        if(err){
            console.log('MysqlLogger get connection error: ', err);
            return;
        }
        var sql = 'INSERT INTO gdas_log4j_wechat (LEVEL, LOCATION, MESSAGE) VALUES("'+ level +'", "'+ location +'", "'+ message +'")';
        connection.query(sql, function (queryErr, rows) {
            if(queryErr){
                console.log('log to database failed, error: ', queryErr);
            } else {
                // console.log('log to database success');
            }
        })
    });
    callback(null, true);
};

function deleteBracket(message) {
    message = message.replace(/\[/g, "");
    message = message.replace(/\]/g, "");
    return message;
}

function ObjStringify(obj) {
    var str = "";
    for(var key in obj){
        str += "[" + key + ':' + deleteBracket(obj[key]) + ']';
    }
    return str;
}