var config = require('../../config');
var accessTokenController = require('./AccessTokenController');
var request = require('request');

module.exports.customMenu = function (callback, req) {
    var accessToken = accessTokenController.getAccessToken();
    console.log('\n\naccessToken    '+accessToken + '\n\n');
    // console.log('ready to customMenu, accessToken is : ' + accessToken);
    request({
        url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + accessToken,
        method: 'POST',
        json: {
            "button": [
                {
                    "type": "click",
                    "name": "系统公告",
                    "key": "notice"
                },
                {
                    "name": "菜单",
                    "sub_button": [
                        {
                            "type": "view",
                            "name": "系统公告页",
                            "url": "http://s15h440013.imwork.net/notice"
                        },
                        {
                            "type": "view",
                            "name": "视频",
                            "url": "http://v.qq.com/"
                        },
                        {
                            "type": "click",
                            "name": "赞一下我们",
                            "key": "praise"
                        }]
                }]
        }
    }, function (err, response, body) {
        if(err){
            console.log('customMenu 请求失败');
            return;
        }
        console.log('customMenu 请求成功： ', body);
        callback();
    })
};