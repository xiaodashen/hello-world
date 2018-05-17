var express = require('express')
var router = express.Router()
var path = require('path')
var index = require('../api_control/index.js')//引入模型文件导出的模块

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
module.exports = router
router.post('/commonpost', index.commonpost)
router.put('/commonput', index.commonput)
router.get('/commonget', index.commonget)
router.delete('/commondel', index.commondel)
router.post('/commonpostmul', multipartMiddleware, index.commonpostmul)
