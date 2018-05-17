const url = 'http://192.168.1.124'
// const url = 'http://172.17.65.74'


exports.baseUrl =  {
  tika_app: url + ':10005',
  tika_web: url + ':10005',
  tika_tiku: url + ':10005',
  tika_vip: url + ':10005',
  tika_goods: url + ':10005',
  tika_agency: url + ':10005',
  tika_paper: url + ':10005',
  tika_system: url + ':10005',
  tika_rbac: url + ':10005',
  tika_user: url + ':10005',
  tika_news: url + ':10005',
  tika_updata: url + ':10005',


  // tika_tiku: 'http://192.168.1.111:30012',
  // tika_goods: 'http://192.168.1.103:30003',
  // tika_agency: 'http://192.168.1.105:30001',
  // tika_system: 'http://192.168.1.111:30009',
  // tika_rbac: 'http://192.168.1.103:30006',
  // tika_news:'http://192.168.1.254:30005',
  // tika_updata: 'http://192.168.1.103:30015',
  //   tika_user: 'http://192.168.1.105:30016',


}



exports.headers = {
   'Content-Type': 'application/json;charset=UTF-8',
   'product': 'web'
}

