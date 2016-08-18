var iconv = require('iconv-lite');

/**
 * 由于数据库是latin1的，每次请求数据库都要重新转码，所以这里做了一层处理
 *
 * @author lzh
 * @date 2016-07-29 05:57
 * @param fn connection.query(sql, toUTF8( fn ))
 */
module.exports = function (fn) {
    return function (err, rows, fields) {
        fn(err, JSON.parse(iconv.decode(JSON.stringify(rows), 'gbk')), fields);
    }
};
