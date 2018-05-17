var express = require('express')
var config  =require('./config/index')

var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var apiRoutes = require('./api_router/index')
app.use('/api', apiRoutes)

//静态资源目录
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.export= app.listen(port,function(err){
  if(err){
    console.log(err)
    return
  }
  console.log('listening at http://localhost:' + port + '\n')

})
