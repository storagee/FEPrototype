var wechat = require('wechat');
var config = require('../../config');

/**
 * 等待回复
 *
 * @author lzh
 * @date 2016-07-23 12:29
 */

module.exports.reply = wechat(config.app, wechat.text(function (message, req, res) {
    console.log(message);
    var input = (message.Content || '').trim();

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

    if (input === '大王') {
        return res.reply("不要叫我大王，要叫我女王大人啊……");
    }
    if (input.length < 2) {
        return res.reply('内容太少，请多输入一点:)');
    }

    var from = message.FromUserName;
    var content = '';
    if (from === 'oPKu7jgOibOA-De4u8J2RuNKpZRw') {
        content = '主人你好：\n' + content;
    }
    if (from === 'oPKu7jpSY1tD1xoyXtECiM3VXzdU') {
        content = '女王大人:\n' + content;
    }
    console.log(content);
    res.reply(content);
}).image(function (message, req, res) {
    console.log(message);
    res.reply('还没想好图片怎么处理啦。');
}).location(function (message, req, res) {
    console.log(message);
    res.reply('想和我约会吗，不要的啦。');
}).voice(function (message, req, res) {
    console.log(message);
    res.reply('心情不好，不想搭理你。');
}).link(function (message, req, res) {
    console.log(message);
    res.reply('点连接进来的是吧！');
}).event(function (message, req, res) {
    console.log(message);
    if (message.Event === 'subscribe') {
        // 用户添加时候的消息
        res.reply('谢谢添加Node.js公共帐号:)\n回复Node.js API相关关键词，将会得到相关描述。如：module, setTimeout等');
    } else if (message.Event === 'unsubscribe') {
        res.reply('Bye!');
    } else {
        res.reply('暂未支持! Coming soon!');
    }
}));