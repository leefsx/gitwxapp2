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
    carts:[],
    total_price:0,
    nowtime: '',
    oid: '',
    cuser: [],
    address: [],
    lastPrice:0,
    openid: '',
    product: [],
    order: [],
    disass: []
    
  },
  addAddr(){
    wx.navigateTo({
      url: '../address/address',
    })
  },
  onLoad: function (options) {
    var oid = options.oid
    var carts = app.globalData.carts
    var openid = wx.getStorageSync('openid');
    var that = this
    if(oid){
      app.request({
        url: comm.parseToURL('order','getorder'),
        data: {oid: oid},
        success: function(res){
          if(res.data.result=='OK'){
            var order = res.data.order
            var product  = res.data.product
            var disass = res.data.disass
            that.setData({
              order: order,
              product: product,
              disass: disass,
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
  onShow: function () {
    let start_date=util.formatTime2(new Date);
    //console.log(start_date)
    this.setData({
      start_date: start_date,
      date: start_date
    })
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          delivery_addr: true,
          address: res.data
        })
      }
    })
  },
  payOrders(opt) {
    wx.showToast({
      title: '请求中...',
      icon: 'loading',
      duration: 5000
    })
    var oid = opt.target.dataset.oid
    if (oid) {
      wx.navigateTo({
        url: '../order_confirm/order_confirm?fr=u&oid=' + oid,
      })

    } else {
      wx.showToast({
        title: '请求失败',
        icon: 'loading',
        duration: 5000
      })
    }

  },
  // 取消订单
  cancelOrders() {
    var oid = this.data.oid
    var order = this.data.order
    let that = this
    wx.showModal({
      title: '温馨提示：',
      content: '是否确认取消该订单',
      success: function (res) {
        if (res.confirm) {
          // 确认操作
          app.request({
            url: comm.parseToURL('order', 'remove'),
            method: 'GET',
            data: { oid: oid, otype: 'cancel' },
            success: function (res) {
              if (res.data.result == 'OK') {
                order.order_status = 5
                that.setData({
                  order: order
                })
              } else {
                wx.showToast({
                  title: '取消失败'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          // 不做任何操作
        }
      }
    })
  },
  deleteOrderList() {
    const oid = this.data.oid
    let that = this
    wx.showModal({
      title: '温馨提示：',
      content: '是否确认删除该订单',
      success: function (res) {
        if (res.confirm) {
          app.request({
            url: comm.parseToURL('order', 'remove'),
            method: 'GET',
            data: { oid: oid, otype: 'remove' },
            success: function (res) {
              if (res.data.result == 'OK') {
                wx.redirectTo({
                  url: '../order-list/order-list?activeIndex=all'
                })
              } else {
                wx.showToast({
                  title: '删除失败'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          // 不做任何操作
        }
      }
    })
  }
})




