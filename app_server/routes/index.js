var express = require('express');
var router = express.Router();
var autoReplayController = require('../controllers/AutoReplyController');
var noticeController = require('../controllers/NoticeController');

router.post('/', autoReplayController.reply);

router.get('/notice', noticeController.renderNoticePage);

module.exports = router;
