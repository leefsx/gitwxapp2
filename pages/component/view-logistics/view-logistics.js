// order_confirm.js
// <import src ="utils/common/nav.wxml" />
import util from "../../../utils/util.js"  
var comm = require('../../../common/common.js');
var config = require('../../../common/config.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: 10,
    status:'',
    logisticname: '',
    logisticno: '',
    product: [],
    config: []
  },
  onLoad: function (options) {
    var oid = options.oid
    var carts = app.globalData.carts
    var openid = wx.getStorageSync('openid');
    var that = this
    that.setData({
      config: config
    })
    if (oid) {
      app.request({
        url: comm.parseToURL('order', 'getorder'),
        data: { oid: oid },
        success: function (res) {
          if (res.data.result == 'OK') {
            var product = res.data.product
            that.setData({
              product: product,
            })
          } else {
            wx.showToast({
              title: '参数错误！',
              duration: 2500
            })
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '参数错误！',
        duration: 2500
      })
      wx.navigateBack({
        delta: 1
      })
    }
    if(oid){
      app.request({
        url: comm.parseToURL('order', 'logisticsState'),
        data: {oid: oid},
        success: function(res){
          if (res.data.result == 'OK') {
            that.setData({
              info: res.data.content,
              status: res.data.status,
              logisticname: res.data.logisticname,
              logisticno: res.data.logisticno
            })
          }else{
            var err = res.data.errmsg || '参数错误！'
            wx.showToast({
              title: err,
              duration: 2500
            })
            // wx.navigateBack({
            //   delta: 1
            // })
          }
        }
      })
    }else{
      wx.showToast({
        title: '参数错误！',
        duration: 2500
      })
      wx.navigateBack({
        delta: 1
      })
    }
    
  }
})




