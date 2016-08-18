var mysql = require("mysql"),
    pools = require("../../config").pools,
    poolCache = {};

module.exports.getPoolConnection = function (dbName, callback) {
    if(poolCache[dbName]){
        poolCache[dbName].getConnection(callback);
    } else if (pools[dbName]){
        var pool = mysql.createPool(pools[dbName]);
        pool.getConnection(callback);
        poolCache[dbName] = pool;
    } else {
        throw new Error("database not found");
    }

};