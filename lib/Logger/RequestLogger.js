var xml2js = require('xml2js')
    , requestData = require('./RequestData')
    , Logger = {};

Logger.create = function (logger, format) {

    return function (req, res, next) {
        var buffers = [];
        req.on('data', function (trunk) {
            buffers.push(trunk);
        });
        req.on('end', function () {
            var xml = Buffer.concat(buffers).toString('utf-8');
            xml2js.parseString(xml, {trim: true}, function (err, result) {
                req.weixin = result? result.xml : null;
                
                var data = requestData.getData(req);
                data.location = "RequestLogger.js";
                logger.info(data);
            });
        });

        next();
    };
};

module.exports = Logger;
