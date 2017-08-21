//app.js
var config = require('./common/config.js');
App({
  domain: config.domain,
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var openid = wx.getStorageSync('openid');
    if (openid) {
      //console.log('oid:' + openid);
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: config.domain + '/api/weixin/get_wxaopenid',
              dataType: 'json',
              data: {
                code: res.code,
                apitoken: config.apitoken
              },
              method: 'GET',
              success: function (res) {
                if (!res.data.errcode) {
                  wx.setStorageSync('openid', res.data.openid);
                  wx.setStorageSync('session_key', res.data.session_key);
                } else {
                }
              },
              fail: function () {
                console.log('request fail!');
              },
              complete: function () {
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  request: function (obj) {
    var that = this;
    obj.data.APISESSID = this.globalData.APISESSID || ''
    obj.data.apitoken = config.apitoken
    // This must be wx.request !
    var method = 'application/json'
    if(obj.method&&obj.method=='POST'){
      method = 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: obj.url,
      data: obj.data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //console.log(res);
        typeof obj.success == "function" && obj.success(res)
        if (!that.globalData.APISESSID && res.data.APISESSID) that.globalData.APISESSID = res.data.APISESSID;
      },
      fail: obj.fail || function () { },
      complete: obj.complete || function () { }
    })
  },

  globalData: {
    userInfo: null,
    APISESSID: null,
    carts: [],
    cuser: [],
    barTocartID:null,
  }
})
