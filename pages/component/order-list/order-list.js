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
    deleteOrderList(e) {
      const id = e.currentTarget.dataset.id;
      const index = e.currentTarget.dataset.index;
      let that = this
      wx.showModal({
        title: '温馨提示：',
        content: '是否确认删除该订单',
        success: function (res) {
          if (res.confirm) {
            app.request({
              url: comm.parseToURL('order', 'remove'),
              method: 'GET',
              data: { oid: id },
              success: function (res) {
                if (res.data.result == 'OK') {
                  var orders = that.data.orders
                  orders.splice(index,1)
                  that.setData({
                    orders: orders
                  })
                }else{
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