var app = getApp()
var comm = require('../../../common/common.js');

Page({
    data: {
        activeIndex: 0,
        order: {},
        prompt: {
            hidden: !0,
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
        orders: [],
        order_pro_rel: []
    },
    onLoad(options) {
        if (options.activeIndex) {
            var that = this;
            that.setData({
                activeIndex: options.activeIndex
            })
            var type = 'all'
            if (options.activeIndex && options.activeIndex != '0'){
              type = options.activeIndex
            }
            app.request({
              url: comm.parseToURL('user', 'order_list'),
              method: 'GET',
              data: { type: type },
              success: function (res) {
                if (res.data.result == 'OK') {
                  that.setData({
                    orders: res.data.data || [],
                    order_pro_rel: res.data.order_pro_rel
                  })
                }
              }
            })
        }
    },
    changActive(e){
        var that = this
        const id = parseInt(e.currentTarget.dataset.id);
        that.setData({
            activeIndex: id
        })
        var type = 'all'
        if (id == '1'){
          type = 'hadpay'
        } else if (id == '2') {
          type = 'nopay'
        } else if (id == '3') {
          type = 'delivery'
        } else if (id == '4') {
          type = 'getit'
        }
        app.request({
          url: comm.parseToURL('user', 'order_list'),
          method: 'GET',
          data: { type: type },
          success: function (res) {
            if (res.data.result == 'OK') {
              that.setData({
                orders: res.data.data || [],
                order_pro_rel: res.data.order_pro_rel
              })
            }
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

    }
})