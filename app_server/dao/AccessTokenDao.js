var toUTF8 = require('./ToUTF8');
var pool = require('./DBConnectPool');
var logger = require('../../lib/Logger/UDataLogger');

module.exports.setAccessToken = function (data, callBack) {
    pool.getPoolConnection('gdas', function (err, connection) {
        if (err) {
            console.log('get connection from pool failed in setAccessToken: ', err);
            return;
        }
        var sql = 'REPLACE INTO gdas_wechat_access_token (id, access_token, expires_in) values(1, "' + data.access_token + '", ' + data.expires_in + ')';

        connection.query(sql, function (queryErr, rows) {
            if (queryErr) {
                console.log('set access_token err: ', err);
                callBack({
                    isSuccess: false,
                    err: err
                });
            } else {
                // console.log('set access_token success: ', rows);
                callBack({
                    isSuccess: true
                });
                logger.info({
                    message: 'access_token update',
                    sql: sql
                });
            }
            connection.release();
        });
    })
};

module.exports.getAccessToken = function (callBack) {
    pool.getPoolConnection('gdas', function (err, connection) {
        if (err) {
            console.log('Error: get connection from pool in getAccessToken: ', err);
            return;
        }
        connection.query('SELECT * FROM gdas_wechat_access_token WHERE id = 1', toUTF8(function (queryErr, rows) {
            if (queryErr) {
                console.log('select access_token from gdas_wechat_access_token failed: ', err);
                callBack({
                    isSuccess: false
                });
            } else {
                callBack({
                    isSuccess: true,
                    rows: rows
                })
            }
            connection.release();
        }))
    })
};