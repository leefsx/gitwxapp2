
//获取应用实例
var comm = require('../../../common/common.js');
var app = getApp()
Page({
  data: {
    motto: '用户登录',
    userInfo: {},
    userName: '',
    userPassword: '',
    boo: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPasswordInput: function (e) {
    this.setData({
      userPassword: e.detail.value
    })
  },
  logIn: function () {
    var that = this
    var openid = wx.getStorageSync('openid');

    app.request({
      url: app.domain + '/api/weixin/dologin',
      data:{
        username: this.data.userName,
        password: this.data.userPassword,
        openid: openid
      },
      method: 'POST',
      success: function(res){
        if (res.data.result=='OK'){
          app.globalData.APISESSID = res.data.APISESSID;
          wx.switchTab({
            url: `../user_new/user_new`
          })
        }else{
          wx.showToast({
            title: '帐号或密码错误！'
          })
        }
        
      }
    })

  },
  auto_registered: function(opt){
    var that = this
    var openid = wx.getStorageSync('openid');
    app.request({
      url: comm.parseToURL('weixin','auto_registered'),
      data: {
        openid: openid,
        headphoto: that.data.userInfo.avatarUrl,
        nickName: that.data.userInfo.nickName
      },
      method: 'POST',
      success: function(res){
        console.log(res)
        if(res.data.result=='OK'){
          app.globalData.APISESSID = res.data.APISESSID
          wx.showToast({
            title: '注册成功'
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '请求失败！'
          })
        }
      }
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  onShow: function () {
    var self = this;
    var openid = wx.getStorageSync('openid');
    if (openid) {
      var url = comm.parseToURL('weixin', 'signin')
      var uinfo = self.data.userInfo
      app.request({
        url: url,
        data: {
          openid: openid,
          nickName: uinfo.nickName || '',
          avatarUrl: uinfo.avatarUrl || ''
        },
        method: 'GET',
        success: function (res) {
          if (res.data.result == 'OK') {
            app.globalData.cuser = res.data
            wx.navigateBack({
              
            })
          }
        }
      })
    }
  },
  shuaxin: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  onReady: function () {
    console.log('indx is on ready')
  },
  onHide: function () {
    console.log('index is on hide')
  },
  onUnload: function () {
    console.log('indx is on unload')
  },
  boo: function () {
    this.setData({
      boo: !this.data.boo
    });
  }


})