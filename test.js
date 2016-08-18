var iconv = require('iconv-lite');

// Convert from an encoded buffer to js string.
str = iconv.decode("ÌìÏÂ3¹«¸æ£¬»áÂÒÂëÂð£¿²âÊÔÒ»ÏÂ", 'latin1');

// Convert from js string to an encoded buffer.
// buf = iconv.encode("Sample input string", 'win1251');

console.log(str)