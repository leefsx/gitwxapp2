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
    wjxNum: ['/image/wjx.png', '/image/wjx.png', '/image/wjx.png', '/image/wjx.png','/image/wjx.png']
  },
  onLoad: function (options) {
    var oid = options.oid
    var carts = app.globalData.carts
    var openid = wx.getStorageSync('openid');
    var that = this
    if(oid){
      app.request({
        url: comm.parseToURL(),
        data: {oid: oid},
        success: function(res){
          if(res.data.result=='OK'){
            
          }else{
            wx.showToast({
              title: '参数错误！',
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
  },
  selectStar(e) {
    let index = e.currentTarget.dataset.index;
    let wjxNum = this.data.wjxNum;
    for (let key in wjxNum) {
      wjxNum[key] = '/image/wjx.png'
    }
    for (let key in wjxNum) {
      if(key <= index){
        wjxNum[key] ='/image/wjx-select.png'
      }
    }
    this.setData({
      wjxNum: wjxNum
    })
  }
})



