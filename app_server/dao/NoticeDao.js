var toUTF8 = require('./ToUTF8');
var pool = require('./DBConnectPool');
var logger = require('../../common/Logger/Logger');


module.exports.getNoticeList = function (callBack) {
    var notices = [];
    pool.getPoolConnection('gdas', function (err, connection) {
        if (err) {
            console.log('get connection from pool failed in getNoticeList: ', err);
            return;
        }
        var sql = 'SELECT * FROM gdas_notice';
        connection.query(sql, toUTF8(function (queryErr, rows) {
            if (queryErr) {
                console.log('database query error: ', err);
                callBack({
                    isSuccess: false,
                    err: err
                })
            } else {
                logger.info({sql: sql});
                for (var i = 0; i < rows.length; i++) {
                    notices.push(rows[i].msg);
                }
                callBack({
                    isSuccess: true,
                    notices: notices
                });
            }
            connection.release();
        }));
    });

};