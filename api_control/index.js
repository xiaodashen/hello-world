var axios = require('axios')
var config = require('./config')


exports.commonpost = function (req, res) {
  var dataBody = req.body
  var value = dataBody.data.value
  var url = config.baseUrl[value] + dataBody.url
  var data = dataBody.data.format
  var flag = 0
  if(dataBody.url === '/v1/privilege/auth/super/idpasswordwd' || dataBody.url === '/v1/agency/auth/agency/idpassword'){
    flag = 1
    config.headers.agencyCode=''
    config.headers.token=''
    console.log('================================')
    console.log(config.headers)
  }

  axios({
    method: 'post',
    url: url,
    timeout: 60000,
    data: data,
    headers: config.headers
  }).then((response) => {
    if(1 === flag){
      config.headers.token = response.data.result.loginInfo.token
      flag = 0
    }

    if(dataBody.url === '/v1/privilege/auth/super/idpasswordwd'){
      config.headers.agencyCode = response.data.result.agencyCode
    }
    if(dataBody.url === '/v1/agency/auth/agency/idpassword'){
      config.headers.agencyCode = response.data.result.userInfo.agencyCode
    }

    console.log('dataBody-------------------------------->')
    console.log(dataBody)

    console.log('config.headers-------------------------------->')
    console.log(config.headers)

    console.log('response.data---------------------------------->')
    console.log(response.data)
    res.json(response.data)
}).catch((e) => {
    console.log('e----------------------->')
    console.log(e)
    var message = errorFunction(e)
    res.json(message)
  })
}

exports.commonput = function (req, res) {
  const dataBody = req.body
  var value = dataBody.data.value
  var url = config.baseUrl[value] + dataBody.url
  var data = dataBody.data.format
  console.log(url)
  console.log(data)
  axios({
    method: 'put',
    url: url,
    timeout: 60000,
    data: data,
    headers: config.headers
  }).then((response) => {

    console.log('dataBody-------------------------------->')
    console.log(dataBody)

    console.log('response.data---------------------------------->')
    console.log(response.data)
    res.json(response.data)
  }).catch((e) => {
      var message = errorFunction(e)
      res.json(message)
  })
}

exports.commonget = function (req, res) {
  var joinUrl = req.query
  var value = req.query.value
  var url = config.baseUrl[value] + joinUrl.url
  var trueFalse = url.indexOf('?') >= 0
  if(trueFalse){
    url = url + "&time=" + (new Date()).valueOf()
  }else{
    url = url + '?time='+ (new Date()).valueOf()
  }

  axios({
    method: 'get',
    url: url,
    timeout: 60000,
    headers: config.headers
  }).then((response) => {
    console.log('joinUrl-------------------------------->')
    console.log(joinUrl)
    console.log('response.data---------------------------------->')
    console.log(response.data)
    res.json(response.data)
}).catch((e) => {
    var message = errorFunction(e)
    res.json(message)
})
}

exports.commondel = function (req, res) {
  var joinUrl = req.query
  var value = req.query.value
  var url = config.baseUrl[value] + joinUrl.url

  axios({
    method: 'delete',
    url: url,
    timeout: 60000,
    headers: config.headers
  }).then((response) => {

    console.log('joinUrl-------------------------------->')
    console.log(joinUrl)

    console.log('response.data---------------------------------->')
    console.log(response.data)
    res.json(response.data)
  }).catch((e) => {
      var message = errorFunction(e)
      res.json(message)
  })
}

exports.commonpostmul = function (req, res) {

  var dataBody = req.body
  var value = dataBody.data.value

  var head = dataBody.data.headers
  var url = config.baseUrl[value] + dataBody.url
  var data = dataBody.data.format

  axios({
    method: 'post',
    url: url,
    timeout: 60000,
    data: data,
    headers: config.headersMul
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
      var message = errorFunction(e)
      res.json(message)
  })
}

function errorFunction (e) {
  console.log('e.toString()---------------------------------->')
  console.log(e.toString())
  var errorMessage1 = e.toString().substr(7,7)
  var errorMessage2 = e.toString().substr(7,11)
  var errorMessage3 = e.toString().substr(33,5)
  var errorMessage4 = e.toString().substr(7,6)
  console.log(errorMessage3)
  var messageData = {status: 1000,message: ''}
  if(errorMessage1 === 'timeout'){
    messageData.message = '请求超时!!!'
  }else if(errorMessage2 === 'getaddrinfo'){
    messageData.message = '连接错误!!!'
  }else if(errorMessage3 === 'token'){
    messageData.message = '用户信息获取失败!!!'
  }else if(errorMessage4 === 'failed'){
    messageData.message = '连接失败!!!'
  }else{
    messageData.message = '其他错误!!!'
  }
  return messageData

}

