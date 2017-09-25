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
                  console.log(res.data)
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
    // 取消订单
    cancelOrders(e){
      const oid = e.currentTarget.dataset.oid;
      const index = e.currentTarget.dataset.index;
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
                  this.onLoad()
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
    // 确认订单
    confirmOrders(e){
      const oid = e.currentTarget.dataset.oid;
      let that = this
      wx.showModal({
        title: '温馨提示：',
        content: '是否确认收货',
        success: function (res) {
          if (res.confirm) {
            // 确认操作
          } else if (res.cancel) {
            console.log('用户点击取消')
            // 不做任何操作
          }
        }
      })
    },
    // 提醒卖家发货
    remind(e){
      const oid = e.currentTarget.dataset.oid;
      let that = this 
      // 提醒发货操作
      app.request({
        url: comm.parseToURL('order', 'order_notice'),
        method: 'GET',
        data: { oid: oid },
        success: function (res) {
          if (res.data.result == 'OK') {
            wx.showToast({
              title: '已提醒卖家及时发货'
            })
          } else {
            wx.showToast({
              title: '请求失败'
            })
          }
        }
      })
    },
    buyAgain(e) {
      var oid = oid = e.currentTarget.dataset.oid;
      if (oid) {
        wx.navigateTo({
          url: '../details/details?oid=' + oid,
        })
      } else {
        wx.showToast({
          title: '请求失败',
          icon: 'loading',
          duration: 5000
        })
      }
    },
    viewLogistics(e){
      var oid = oid = e.currentTarget.dataset.oid;
      if (oid) {
        wx.navigateTo({
          url: '../view-logistics/view-logistics?oid=' + oid,
        })
      } else {
        wx.showToast({
          title: '请求失败',
          icon: 'loading',
          duration: 5000
        })
      }
    },
    rating(e) {
      var oid = oid = e.currentTarget.dataset.oid;
      if (oid) {
        wx.navigateTo({
          url: '../ratings/ratings?oid=' + oid,
        })
      } else {
        wx.showToast({
          title: '请求失败',
          icon: 'loading',
          duration: 5000
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
      const oid = e.currentTarget.dataset.oid;
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
              data: { oid: oid, otype:'remove' },
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