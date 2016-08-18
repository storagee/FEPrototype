var wechat = require('wechat');
var request = require('request');
var menuController = require('./MenuController');
var noticeController = require('./NoticeController');
require('date-util');
var config = require('../../config');

module.exports.reply = wechat(config.app, wechat.text(function (message, req, res) {
    // console.log(message);
    var input = (message.Content || '').trim();

    if (input === 'notice') {
        noticeController.queryNotice(function (notices) {
            var noticeStr = '';
            for (var i = 0; i < notices.length; i++) {
                noticeStr += '公告' + (i + 1) + ': ' + notices[i] + '\n\n';
            }
            res.reply(noticeStr);
        }, req)
    }

    if (input == 'menu') {
        menuController.customMenu(function () {
            res.reply('已更新自定义菜单，如果没有看到变化，请等待5分钟，等待5分钟还无变化，说明你的菜单是最新的');
        });
    }

    if (input === 'login') {
        res.reply([{
            title: '登陆页面',
            description: '去登陆',
            picurl: 'test.jpg',
            url: '/loin'
        }]);
        return;
    }

    // if (input === '天气') {
    //     res.wait('weather');
    // }

    if (input === 'now') {
        return res.reply('现在时间是：' + new Date().format('yyyy-mm-dd HH:MM:ss'));
    }
    if (input.length < 2) {
        return res.reply('内容太少，请多输入一点:)');
    }

    if (input === 'hello') {
        var from = message.FromUserName;
        var content = '';
        if (from === 'oqBpNv7uHbwRzQ-00vbAaU-ylvuo') {
            content = 'hello master';
        } else {
            content = 'who are you?'
        }
        // console.log(content);
        res.reply(content);
    }
}).image(function (message, req, res) {
    console.log(message);
    res.reply('pic');
}).location(function (message, req, res) {
    console.log(message);
    res.reply('location');
}).voice(function (message, req, res) {
    console.log(message);
    res.reply('voice');
}).link(function (message, req, res) {
    console.log(message);
    res.reply('link');
}).event(function (message, req, res) {
    if (message.Event === 'subscribe') {
        // 用户添加时候的消息
        res.reply('欢迎关注FEPrototype公众号');
    } else if (message.Event === 'unsubscribe') {
        res.reply('Bye!');
    } else if (message.Event === 'CLICK') {
        var eventKey = message.EventKey;
        switch (eventKey) {
            case 'notice' :
            {
                noticeController.queryNotice(function (notices) {
                    var noticeStr = '';
                    for (var i = 0; i < notices.length; i++) {
                        noticeStr += '公告' + (i + 1) + ': ' + notices[i] + '\n\n';
                    }
                    res.reply(noticeStr);
                }, req);
                break;
            }
            case 'praise' :
            {
                res.reply('谢谢您的支持!');
                break;
            }
        }
    } else {
        res.reply('暂未支持! Coming soon!');
    }
}));