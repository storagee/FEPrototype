var url = require('url'),
    useragent = require('useragent');

module.exports.getData = function (req) {
    var requestedUrl = url.parse(req.originalUrl)
        , startTime = new Date();


    // Our format argument above contains key-value pairs for the output
    // object we send to Winston. Let's use this to format our results:
    var data = {};
    var userAgent = useragent.parse(req.headers['user-agent']).toString();
    userAgent = (userAgent != "Other 0.0.0 / Other 0.0.0" ) ? userAgent : req.headers['user-agent'];
    var weixin = req.weixin ? JSON.stringify(req.weixin) : "-";
    // var request = JSON.stringify(req);
    var tokens = {
        ':method': req.method,
        ':date': startTime.format('yyyy-mm-dd HH:MM:ss'),
        // ':statusCode': _colorStatus(res.statusCode),
        ':responseTime': (new Date() - startTime),
        ':url\\[([a-z]+)\\]': function (str, segment) {
            return requestedUrl[segment];
        },
        ':ip': req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress,
        ':openId': req.query.openid ? req.query.openid : "-",
        ':userAgent': userAgent,
        ':weixin': weixin
    };

    // Let's define a default format
    if (typeof(format) !== 'object') {
        format = {
            method: ':method',
            date: ':date',
            // status: ':statusCode',
            url: ':url[pathname]',
            response_time: ':responseTime',
            openId: ':openId',
            user_agent: ':userAgent',
            weixin: ':weixin'
        };
    }

    // ... and replace our tokens!
    var replaceToken = function (str, match) {
        return tokens[token];
    };
    for (var key in format) {
        data[key] = format[key];
        for (var token in tokens) {
            data[key] = data[key].replace(new RegExp(token), typeof(tokens[token]) === 'function' ? tokens[token] : replaceToken);
        }
    }
    return data;
};