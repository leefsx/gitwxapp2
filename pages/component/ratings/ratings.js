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
    wjxNum: ['/image/wjx.png', '/image/wjx.png', '/image/wjx.png', '/image/wjx.png','/image/wjx.png'],
    score: '',
    content: '',
    submit: true,
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
        url: comm.parseToURL('order', 'orderCommentsub'),
        data: {
          oid: oid,
          type: '1'
        },
        success: function (res) {
          if (res.data.result == 'OK') {
            var score = parseInt(res.data.score)
            if(score>0){
              let wjxNum = that.data.wjxNum;
              for (let key in wjxNum) {
                wjxNum[key] = '/image/wjx.png'
              }
              for (let key in wjxNum) {
                if (key <= score) {
                  wjxNum[key] = '/image/wjx-select.png'
                }
              }
              that.setData({
                content: res.data.content,
                score: score,
                wjxNum: wjxNum,
                submit: false
              })
            }
          } else {
          }
        }
      })
      that.setData({
        oid: oid
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
    let submit = this.data.submit
    if (submit == false) return false
    for (let key in wjxNum) {
      wjxNum[key] = '/image/wjx.png'
    }
    for (let key in wjxNum) {
      if(key <= index){
        wjxNum[key] ='/image/wjx-select.png'
      }
    }
    this.setData({
      wjxNum: wjxNum,
      score: index
    })
  }, 
  binkContentConfirm(e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit(e){
    var score = this.data.score
    var content = this.data.content
    var oid  = this.data.oid
    if (score.length < 1) {
      wx.showToast({
        title: '请选择评分',
      })
    } else if (content.length < 1) {
      wx.showToast({
        title: '请填写评价',
      })
    }else{
      app.request({
        url: comm.parseToURL('order', 'orderCommentsub'),
        data: {
          oid: oid,
          score: score,
          content: content
        },
        success: function (res) {
          if (res.data.result == 'OK') {
            wx.redirectTo({
              url: '../order-list/order-list?activeIndex=all',
            })
          } else {
            var res = res.data.errmsg || '请求失败'
            wx.showToast({
              title: res
            })

          }
        }
      })
    }
    
  }
})




