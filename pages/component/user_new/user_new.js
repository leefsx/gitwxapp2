// page/component/new-pages/user/user.js
var comm = require('../../../common/common.js');
var app = getApp();
Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{},
    order_pro_rel:[],
    userInfo: [],
    cuserInfo: []
  },
  onLoad(){
  },
  onShow() {
    var self = this;
    var openid = wx.getStorageSync('openid');
    console.log('oi:'+openid)
    if (openid) {
      var url = comm.parseToURL('weixin', 'signin')
      var uinfo = self.data.userInfo
      app.request({
        url: url,
        data: {
          openid: openid
        },
        method: 'GET',
        success: function (res) {
          if (res.data.result == 'OK') {
            self.setData({cuserInfo:res.data})
            app.globalData.cuserInfo = res.data
            if (app.globalData.userInfo) {
              self.setData({
                userInfo: app.globalData.userInfo
              })
            } else {
              app.getUserInfo(function (userInfo) {
                self.setData({
                  userInfo: userInfo
                })
              })
            }
            app.request({
              url: comm.parseToURL('user', 'order_list'),
              method: 'GET',
              data: [],
              success: function (res) {
                if (res.data.result == 'OK') {
                  self.setData({
                    orders: res.data.data,
                    order_pro_rel: res.data.order_pro_rel
                  })
                }
              }

            })
          } else {
            wx.navigateTo({
              url: '../profile/profile'
            })
          }
        }
      })

    } else {
      wx.navigateTo({
        url: '../profile/profile'
      })
    }
   },
  /**
   * 发起支付请求
   */
  payOrders(opt) {
    wx.showToast({
      title: '请求中...',
      icon: 'loading',
      duration: 5000
    })
    var oid = opt.target.dataset.oid
    if(oid){
      wx.navigateTo({
        url: '../order_confirm/order_confirm?fr=u&oid='+oid,
      })
      /*
      app.request({
        url: comm.parseToURL('order', 'dopayment'),
        data: {
          oid: oid
        },
        method: 'POST',
        success: function (res) {
          if (res.data.result == 'OK') {
            
            wx.showToast({
              title: '支付成功'
            })
            wx.switchTab({
              url: '../user/user',
            })
          } else {
            wx.showToast({
              title: '支付失败'
            })
          }
          
        }
      })
      */

    }else{
      wx.showToast({
        title: '请求失败',
        icon: 'loading',
        duration: 5000
      })
    }

  }
})