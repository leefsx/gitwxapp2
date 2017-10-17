var app = getApp()
var comm = require('../../../common/common.js');
var config = require('../../../common/config.js');

Page({
    data: {
        activeIndex: 0,
        order: {},
        prompt: {
            hidden: !0,
        },
        orders: [],
        order_pro_rel: [],
        config: []
    },
    onLoad(options) {
        this.setData({
          config: config
        })
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
                  console.log(res.data.data)
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
      const activeIndex = this.data.activeIndex
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
                  wx.showToast({
                    title: '操作成功'
                  })
                  wx.redirectTo({
                    url: '../order-list/order-list?activeIndex=' + activeIndex
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
    // 确认订单
    confirmOrders(e){
      const order_id = e.currentTarget.dataset.oid;
      const order_index = e.currentTarget.dataset.index;
      var orders = this.data.orders
      let that = this
      wx.showModal({
        title: '温馨提示：',
        content: '是否确认收货',
        success: function (res) {
          if (res.confirm) {
            // 确认操作
            app.request({
              url: comm.parseToURL('order', 'orderToGet'),
              method: 'GET',
              data: { oid: order_id },
              success: function (res) {
                if (res.data.result == 'OK') {
                  wx.showToast({
                    title: '确认成功'
                  })
                  orders[order_index]['delivery_status_no'] = 4
                  that.setData({
                    orders: orders
                  })
                } else {
                  var err = res.data.errmsg || '请求失败'
                  wx.showToast({
                    title: err
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
    // 提醒卖家发货
    remind(e){
      const order_id = e.currentTarget.dataset.oid;
      let that = this 
      // 提醒发货操作
      app.request({
        url: comm.parseToURL('order', 'order_notice'),
        method: 'GET',
        data: { oid: order_id },
        success: function (res) {
          if (res.data.result == 'OK') {
            wx.showToast({
              title: '已提醒卖家及时发货'
            })
          } else {
            var err = res.data.errmsg || '请求失败'
            wx.showModal({
              content: err
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
                  wx.showToast({
                    title: '操作成功'
                  })
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
      var openid = wx.getStorageSync('openid')
      if (oid && openid) {
        app.request({
          url: comm.parseToURL('order', 'dopayment'),
          data: {
            oid: oid,
            method: 'POST',
            mark: 'new'
          },
          success: function (res) {
            if (res.data.result == 'OK') {
              if (res.data.wxPrice > 0) {
                var temdata = { 'oid': oid, 'openid': openid, 'mark': 'new' }
                //wx pay
                app.request({
                  url: comm.parseToURL('order', 'getprepay_id'),
                  data: {
                    data: JSON.stringify(temdata),
                    method: 'POST'
                  },
                  success: function (res) {
                    if (res.data.result == 'OK') {
                      app.globalData.carts = []
                      res.data.oid = oid
                      comm.pay(res.data)
                    } else {
                      var err = res.data.errmsg || '支付失败'
                      wx.showToast({
                        title: err
                      })
                    }
                  }
                })
              } else {
                app.globalData.carts = []
                wx.showToast({
                  title: '支付成功！',
                  icon: 'success',
                  duration: 2500
                })
                wx.redirectTo({
                  url: '../order_detail/order_detail?oid=' + oid,
                })
              }
            } else {
              var err = res.data.errmsg || '支付失败'
              wx.showToast({
                title: err
              })
              return false;
            }
          }
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