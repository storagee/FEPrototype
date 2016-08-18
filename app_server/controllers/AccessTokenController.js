var request = require('request');
var config = require('../../config');
var accessTokenDao = require('../dao/AccessTokenDao');
var logger = require('../../lib/Logger/UDataLogger');
var accessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.app.appid + '&secret=' + config.app.appsecret;
var accessToken = '';

module.exports.getAccessToken = function () {
    return accessToken;
};

var queryAccessTokenFromWechat = function () {
    request({
        url: accessTokenUrl,
        method: 'GET'
    }, function (err, response, body) {
        body = JSON.parse(body);
        if (err) {
            logger.log('从微信服务器请求AccessToken失败: ', err);
            return;
        }
        accessToken = body.access_token;
        console.log('AccessToken更新: ' + accessToken);
        saveAccessToken(body);
        setTimeout(function () {
            queryAccessTokenFromWechat();
            //每次提前十分钟去请求
        }, (body.expires_in - 600) * 1000);
    })
};

var queryAccessTokenFromDatabase = function () {
    accessTokenDao.getAccessToken(function (data) {
        if (data.isSuccess) {
            if (expired(data.rows)) {
                queryAccessTokenFromWechat();
            } else {
                accessToken = data.rows[0].access_token;
                console.log('\nAccessToken init from database: ' + accessToken + '\n\n');
                var timeRemaining = data.rows[0].expires_in - Date.now();
                setTimeout(function () {
                    queryAccessTokenFromWechat();
                    //每次提前十分钟去请求
                }, timeRemaining - 600000);
            }
        } else {
            console.log('从数据库请求AccessToken失败: ', err);
        }
    });
};

var expired = function (rows) {
    // return true;
    var timeRemaining = rows[0].expires_in - Date.now();
    console.log('\n距离AccessToken过期还有：' + timeRemaining + '毫秒');
    if (rows.length == 0) {
        //此时数据库还没有存access_token，所以判断为失效
        return true;
    } else {
        //如果数据库存的到期时间距离现在已经少于10分钟，则判断为失效
        return rows[0].expires_in - Date.now() < 600000;
    }
};

var saveAccessToken = function (data) {
    accessTokenDao.setAccessToken({
        access_token: data.access_token,
        expires_in: data.expires_in * 1000 + Date.now()
    }, function (message) {
        if (message.isSuccess) {
            console.log('save access token to database success.');
        } else {
            console.log('save access token to database failed: ', message.err);
        }
    });
};

var initAccessToken = function () {
    queryAccessTokenFromDatabase();
};

module.exports.initAccessToken = initAccessToken;

