import axios from 'axios'
var flag = false
export function ApiPost (data, urlPost) {
  var method_type = ''

  if(urlPost === 'api/commonpost'){
    method_type = 'post'
  }
  if(urlPost === 'api/commonput'){
    method_type = 'put'
  }
  return axios({
    method: method_type,
    url: urlPost,
    data: data
  }).then((res) => {
    // return Promise.resolve(res.data)
    var dataTemp = res.data
    return  commonFunction(dataTemp)
  })
}

export function ApiGet (data, urlGet) {
  return axios.get(urlGet, {
    params: data
  }).then((res) => {
    // return Promise.resolve(res.data)
    var dataTemp = res.data
    return  commonFunction(dataTemp)
  })
}

export function ApiDel (data, urlDel) {
  return axios.delete(urlDel, {
    params: data
  }).then((res) => {
    // return Promise.resolve(res.data)
    var dataTemp = res.data
    return  commonFunction(dataTemp)
  })
}

export function ApiMul (data, URL_MUL) {
  var method_type = 'post'
  return axios({
    method: method_type,
    url: URL_MUL,
    headers:data.headers,
    data: data
  }).then((res) => {
    // return Promise.resolve(res.data)
    var dataTemp = res.data
    return  commonFunction(dataTemp)
  })
}

function commonFunction(dataTemp){
  if(dataTemp.status === 401 ){
    if(!flag){
      alert(dataTemp.message)
      sessionStorage.clear()
      flag = true
      window.location.href = '#/login'
    }
  }
  return dataTemp
}
