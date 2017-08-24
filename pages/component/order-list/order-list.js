var app = getApp()
var comm = require('../../../common/common.js');

Page({
    data: {
        activeIndex: 0,
        order: {},
        prompt: {
            hidden: !0,
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
            var type = options.activeIndex
            app.request({
              url: comm.parseToURL('user', 'order_list'),
              method: 'GET',
              data: { type: type },
              success: function (res) {
                if (res.data.result == 'OK') {
                  that.setData({
                    "prompt.hidden": !!res.data.data,
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
        const id = e.currentTarget.dataset.id;
        that.setData({
            activeIndex: id
        })
        var type = id
        app.request({
          url: comm.parseToURL('user', 'order_list'),
          method: 'GET',
          data: { type: type },
          success: function (res) {
            if (res.data.result == 'OK') {
              that.setData({
                "prompt.hidden": !!res.data.data,
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