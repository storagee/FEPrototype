var express = require('express');
var router = express.Router();
var autoReplayController = require('../controllers/AutoReplyController');

router.post('/', autoReplayController.reply);

module.exports = router;
