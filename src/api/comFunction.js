import axios from 'axios'
import { ApiGet,ApiPost } from 'api/recommand'
import { URL_GET, TIKA_SYSTEM } from 'api/config'
export function getQiNiuToken (type) {
  var getData = {
    url: "/v1/systemctl/storage/token/"+ type,
    value: TIKA_SYSTEM
  }
  return ApiGet(getData, URL_GET).then((res) =>{
    if (res.status === 200) {
    var QiNiuMessage = res.result
    //return QiNiuMessage //方案一
    return Promise.resolve(QiNiuMessage)
  } else {
    return Promise.resolve(res.message)
  }
})
}

export function upQiNiuFile(fileData, uptoken, domain){
  var timeData = new Date().getTime()
  var formData = new FormData()
  formData.append('file', fileData)
  formData.append('token', uptoken)
  formData.append('key', timeData)
  return axios({
    url: 'http://upload.qiniu.com/',
    method: 'post',
    data: formData,
    headers: {'Content-Type':'application/json'}
  }).then((result) => {
    var data={}
    var url = domain + '/' + result.data.key // Get url from response
    return data={url:url,status:200}
  }).catch((err) => {
    var data={}
    return data={err:err,status:500}
  })
}

export function getDictionaryData(val){//从数据字典中获取相关信息
  var getData = {
    url: "/v1/systemctl/dictionary/"+val+"/all",
    value: TIKA_SYSTEM
  }

  return ApiGet(getData, URL_GET).then((res)=>{
    console.log('return ApiGet(getData, URL_GET).then((res)=>{')
    console.log(res)
    if(res.status === 200){
      return res.result
    }else if(res.status !== 401)  {
      return null
    }
  })
}

export function levelMap(node, examTreeData, sequrenceNbr, childNode ){
  var levelMap = []

  if(node.level === 1){
    examTreeData.forEach((tempData,index)=>{
      if(sequrenceNbr === tempData.sequenceNbr){
        levelMap.push(index)
      }
    })
  }
  if(node.level === 2){
    examTreeData.forEach((tempData,index)=>{
      if(node.parent.data.sequenceNbr === tempData.sequenceNbr){
        levelMap.push(index)
      }
    })
    var orderNum = levelMap[0]
    var getFirstExamTreeData = examTreeData[orderNum][childNode]
    getFirstExamTreeData.forEach((tempData,index)=>{
      if(tempData.sequenceNbr === sequrenceNbr ){
        levelMap.push(index)
      }
    })
  }
  if(node.level === 3){
    examTreeData.forEach((tempData,index)=>{
      if(node.parent.parent.data.sequenceNbr === tempData.sequenceNbr){
        levelMap.push(index)
      }
    })
    var firstOrderNum = levelMap[0]
    var getSecondExamTreeData =  examTreeData[firstOrderNum][childNode]
    getSecondExamTreeData.forEach((tempData,index)=>{
      if(tempData.sequenceNbr === node.parent.data.sequenceNbr ){
        levelMap.push(index)
      }
    })
    var secondOrderNum =  levelMap[1]
    var getThirdExamTreeData =  examTreeData[firstOrderNum][childNode][secondOrderNum][childNode]
    getThirdExamTreeData.forEach((tempData,index)=>{
      if(tempData.sequenceNbr === sequrenceNbr ){
        levelMap.push(index)
       }
    })
  }

  if(node.level === 4){
     examTreeData.forEach((tempData,index)=>{
        if(node.parent.parent.parent.data.sequenceNbr === tempData.sequenceNbr){
          levelMap.push(index)
        }
     })
    var firstOrderNum =  levelMap[0]
    var getSecondExamTreeData =  examTreeData[firstOrderNum][childNode]
    getSecondExamTreeData.forEach((tempData,index)=>{
      if(tempData.sequenceNbr === node.parent.parent.data.sequenceNbr ){
        levelMap.push(index)
      }
    })
    var secondOrderNum =  levelMap[1]
    var getThirdExamTreeData =  examTreeData[firstOrderNum][childNode][secondOrderNum][childNode]
    getThirdExamTreeData.forEach((tempData,index)=>{
      if(tempData.sequenceNbr === node.parent.data.sequenceNbr ){
        levelMap.push(index)
      }
    })
    var thirdOrderNum =  levelMap[2]
    var getForthExamTreeData =  examTreeData[firstOrderNum][childNode][secondOrderNum][childNode][thirdOrderNum][childNode]
    getForthExamTreeData.forEach((tempData,index)=>{
      if(tempData.sequenceNbr === sequrenceNbr ){
        levelMap.push(index)
      }
    })
  }
  return levelMap
}


