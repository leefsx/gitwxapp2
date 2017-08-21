var app = getApp()

function parseToURL(m,a,arr){
  var domain = app.domain+'/api/'+m+'/'+a+'/';
  var url = domain
  var i = 0
  for(var key in arr){
    if(i==0){
      url += '?' + key + '=' + arr[key];
    }else{
      url += '&' + key + '=' + arr[key];
    }
    i++
  }
  return url;
}

function get_cuser(obj){
  if (app.globalData.cuser.length){
    typeof obj.success == "function" && obj.success(app.globalData.cuser)
    return app.globalData.cuser
  }else{
    var openid = wx.getStorageSync('openid');
    if (openid) {
      app.request({
        url: parseToURL('weixin', 'signin'),
        method: 'GET',
        data: { openid: openid },
        success: function (res) {
          if (res.data.result == 'OK') {
            app.globalData.cuser = res.data
            typeof obj.success == "function" && obj.success(res.data)
            return res.data
          } else {
            typeof obj.success == "function" && obj.success(false)
          }
        },
        fail: function () {
          typeof obj.success == "function" && obj.success(false)
        }
      })
    }
  }
  return false
  
}

function get_now(){
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth();
  var day = myDate.getDate();
  var hour = myDate.getHours();
  var minute = myDate.getMinutes();
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}
 /* 随机数 */
function randomString(){
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < 32; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd; 
}
/* 获取prepay_id */
function getXMLNodeValue(node_name, xml) {
  var tmp = xml.split("<" + node_name + ">")
  var _tmp = tmp[1].split("</" + node_name + ">")
  return _tmp[0]
}
/* 时间戳产生函数   */
function createTimeStamp() {
  return parseInt(new Date().getTime() / 1000) + ''
}
/* 支付   */
function pay(param) {
  wx.requestPayment({
    timeStamp: param.timeStamp,
    nonceStr: param.nonceStr,
    package: param.package,
    signType: param.signType,
    paySign: param.paySign,
    success: function (res) {
      // success  
      wx.navigateTo({
        url: '../order_detail/order_detail?oid='+param.oid,
      })
       
    },
    fail: function (res) {
      // fail  
      console.log("支付失败")
      console.log(res)
    },
    complete: function () {
      // complete  
      console.log("pay complete")
    }
  })
}
function getprocate(obj){
  app.request({
    url: this.parseToURL('product','catelist'),
    data: {},
    success: function(res){
      if(res.data.result == 'OK'){
        typeof obj.success == "function" && obj.success(res.data.data)
      }
    }
  })
}
module.exports.parseToURL = parseToURL
module.exports.get_cuser = get_cuser
module.exports.get_now = get_now
module.exports.randomString = randomString
module.exports.getXMLNodeValue = getXMLNodeValue
module.exports.createTimeStamp = createTimeStamp
module.exports.pay = pay
module.exports.getprocate = getprocate
