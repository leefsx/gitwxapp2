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
    selectCarts:[],
    total_price:0,//实付价格
    nowtime: '',
    oid: '',
    cuser: [],
    order:{
      "id": 1,
      "number": "A4501354410893725",
      "url": "/image/o1.jpg",
      "name": "坚果零食大礼包",
      "count": "3个",
      "status": 0,
      "money": "450",
      "time": "2017-7-5 17:30"
    },
    pay_ways:[
      {
        way_id: 1,
        src: "../../../image/wx.png"
      }
    ],
    pay_way_id:1,
    delivery_mode:[],
    delivery_time:["9:00-12:00","12:00-18:00","18:00-22:00"],
    coupon_mode:[{"name":"未使用"}],
    integral_mode:[0],
    balance_mode:[0.00],
    index_mode: 0,
    index_time: 0,
    index_coupon:0,
    index_integral:0,
    index_balance:0,
    delivery_money:20,
    integral_money: 0.00,//使用的积分抵扣金额
    delivery_addr: false,
    start_date:"",
    end_date: '',
    date:"",
    time: "9:00-12:00",
    message: '',
    address: {
      name: '',
      phone: '',
      detail: ''
    },
    coupon:0,
    integral:0,//使用的积分数
    balance:0,//使用的余额
    invoice_mode: ["不需要", "需要"],
    index_invoice: 0,
    invoice: '',
    pay_mode: ["在线支付"],
    index_pay:0,
    lastPrice:0,//订单总价
    openid: '',
    usercinfo: [],//优惠券数据
    ujfdata: [],//积分余额等用户数据
    perdata: [],//积分抵扣方式数据
    yhjid: 0,
    yhjprice: 0,
    MessageSwitch: '',
    TextModification: '',
    dis_key: false,
    config: []
  },
  submitOrder(){
    wx.showLoading({
      title: '请求中',
      mask: true
    })
    var openid = wx.getStorageSync('openid');
    var delivery_addr = this.data.delivery_addr
    var MessageSwitch = this.data.MessageSwitch
    var dis_key = this.data.dis_key
    if (MessageSwitch=='1'){
      var message = this.data.message
      var TextModification = this.data.TextModification
      if (message == '' || message.length == 0){
        wx.showToast({
          title: '请先添加' + TextModification
        })
        return false
      }
    }
    if (!dis_key){
      wx.showToast({
        title: '请选择配送方式'
      })
      return false
    } else if (dis_key > 1 && !delivery_addr) {
      wx.showToast({
        title: '请先添加收货人信息'
      })
      return false
    }
    
    var total_fee = this.data.total_price;
    var temdata = {
      //oid: oid,
      total_fee: total_fee,
      openid: openid
    }
    var index_time = this.data.index_time
    var delivery_time = this.data.delivery_time
    var selectCarts = this.data.selectCarts
    var carts = this.data.carts
    var fr = this.data.fr
    var order_data = {
      delivery_date: this.data.date,
      delivery_time: delivery_time[index_time],
      address: this.data.address,
      message: this.data.message,
      invoice: this.data.invoice,
      total_price: this.data.total_price,
      lastPrice: this.data.lastPrice,
      yeprice: this.data.balance,
      jfnum: this.data.integral,
      jfprice: this.data.integral_money,
      yhjid: this.data.yhjid,
      yhjprice: this.data.yhjprice,
      dis_key: this.data.dis_key,
      ifee: this.data.ifee
    }
    var that = this
    app.request({
      url: comm.parseToURL('order', 'createOrder'),
      data: {
        cart: JSON.stringify(selectCarts),
        order_data: JSON.stringify(order_data),
        fr: that.data.fr
      },
      method: 'GET',
      success: function (ress) {
        
        if (ress.data.result == 'OK') {
          var oid = ress.data.oid
          app.request({
            url: comm.parseToURL('order', 'createOrderNotice'),
            data: { oid: oid },
            success: function () { }
          })
          if(fr == 'cart') {
            var newCarts = []
            carts.forEach((item) => {
              if (!item.selected) {
                newCarts.push(item)
              }
            })
            app.globalData.carts = newCarts
          }
          app.request({
            url: comm.parseToURL('order', 'dopayment'),
            data: {
              oid: oid,
              method: 'POST',
              mark: 'new'
            },
            success: function (res) {

              if (res.data.result == 'OK') {
                wx.hideLoading()
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
                        // app.globalData.carts = []
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
                  // app.globalData.carts = []
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
          //wx.redirectTo({
          //  url: '../order_detail/order_detail?oid=' + oid
          //})
        } else if (ress.data.errmsg == '2') {
          wx.showToast({
            title: '请先登录'
          })
          wx.navigateTo({
            url: '../login/login'
          })
        } else {
          wx.showToast({
            title: ress.data.errmsg
          })
        }
      }
    })
  },
  bindPickerChange(e){
    var index_mode = e.detail.value
    var weight = parseFloat(this.data.weight)
    var disresult = this.data.disresult
    var curr_dis = disresult[index_mode]
    var ifee = this.data.ifee || 0
    var total_price = parseFloat(this.data.total_price) - ifee
    var lastPrice = parseFloat(this.data.lastPrice) - ifee
    
    if (curr_dis.key > 1 && lastPrice < curr_dis.free_fee){
      if (weight < curr_dis.fweight){
        ifee = parseFloat(curr_dis.f_fee)
      }else{
        ifee = parseFloat(curr_dis.f_fee) + ((weight - parseFloat(curr_dis.f_weight)) / parseFloat(curr_dis.r_weight)) * parseFloat(curr_dis.r_fee)
      }
      total_price += ifee
      lastPrice += ifee
    }else{
      ifee = 0
    }
    this.setData({
      index_mode: index_mode,
      total_price: total_price.toFixed(2),
      dis_key: curr_dis.key,
      delivery_title: curr_dis.title,
      ifee: ifee.toFixed(2),
      lastPrice: lastPrice.toFixed(2)
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e){
    this.setData({
      index_time: e.detail.value
    })
  },
  addAddr(){
    if (!this.data.dis_key || this.data.dis_key > 1){
      wx.navigateTo({
        url: '../address-list/address-list',
      })
    }
  },
  bindInvoiceChange(e){
    this.setData({
      index_invoice: e.detail.value
    })
  },
  bindPayChange(e) {
    this.setData({
      index_pay: e.detail.value
    })
  },
  changePay(e){
    let way_id = e.target.dataset.id
    this.setData({
      pay_way_id: way_id
    })
  },
  binkMessageConfirm(e){
    this.setData({
      message: e.detail.value
    })
  },
  bindCouponChange(e) {
    var coupon_mode = this.data.coupon_mode
    var use_coupon = coupon_mode[e.detail.value]
    var integral_money = this.data.integral_money
    var lastPrice = this.data.lastPrice
    var balance = this.data.balance
    
    var coupon_money = (use_coupon['money']*1).toFixed(2)
    if (e.detail.value == 0){
    }else if (lastPrice >= coupon_money){
      lastPrice = lastPrice - integral_money - balance
      var yhjid = 0
      var yhjprice = 0
      if (e.detail.value == 0){
        var total_price = lastPrice
      }else{
        var total_price = lastPrice - coupon_money
        if (total_price < 0) total_price = 0
        yhjid = use_coupon['u_id']
        yhjprice = coupon_money
      }
      
      this.setData({
        coupon: e.detail.value,
        index_coupon: e.detail.value,
        yhjid: yhjid,
        yhjprice: yhjprice,
        total_price: total_price.toFixed(2)
      })
    }else{
      wx.showToast({
        title: '不满足使用条件！'
      })
    }
    
  },
  bindIntegralChange(e) {
    var perdata = this.data.perdata
    if (perdata.length == 0) return false
    var total_price = this.data.total_price
    var lastPrice = this.data.lastPrice
    var integral_money = this.data.integral_money
    var integral_mode = this.data.integral_mode
    var integral = this.data.integral
    var balance = this.data.balance
    var yhjprice = this.data.yhjprice
    var val = integral_mode[e.detail.value]
    var proportion = parseInt(perdata.redeem_credits) / parseInt(perdata.redeem_money)
    
    if (perdata.limit_type == '2'){
      var limit_val = parseInt(perdata.limit_val) / 100
      var limit_credits = parseInt(lastPrice * limit_val * proportion)
      if (val > limit_credits){
        val = limit_credits
      }
    }else{
      if (val > parseInt(perdata.limit_val)){
        val = parseInt(perdata.limit_val)
      }
    }
    if (val > (lastPrice * proportion)){
      val = lastPrice * proportion
    }

    if (val >= 1 || val == 0){
      integral_money = val / proportion
      lastPrice = lastPrice - balance - yhjprice
      if (lastPrice > 0){
        if (integral_money > lastPrice) {
          integral_money = lastPrice
          val = integral_money * proportion
          if (val % 1 != 0) {
            wx.showModal({
              title: '',
              content: '使用积分数量只能为整数'
            })
            return false
          }
          total_price = 0
        }else{
          total_price = lastPrice - integral_money
        }
      }
      
      this.setData({
        index_integral: val,
        integral_money: integral_money.toFixed(2),
        total_price: total_price.toFixed(2),
        integral: val
      })
    }else{
      wx.showModal({
        title: '',
        content: '使用积分数量不可小于1'
      })
    }
  
  },
  bindBalanceChange(e) {
    var total_price = this.data.total_price
    var integral_money = this.data.integral_money
    var balance_mode = this.data.balance_mode
    var balance = this.data.balance
    var yhjprice = this.data.yhjprice
    var lastPrice = this.data.lastPrice
    var val = Number(balance_mode[e.detail.value])
    lastPrice = lastPrice - integral_money - yhjprice
    if (val > lastPrice){
      val = lastPrice
    }
    total_price = lastPrice - val

    this.setData({
      index_balance: val,
      total_price: total_price.toFixed(2),
      balance: val.toFixed(2)
    })
  },
  onLoad: function (options) {
    var carts = app.globalData.carts
    var selectCarts = app.globalData.selectCarts
    var openid = wx.getStorageSync('openid');
    var total_price = 0
    var now = comm.get_now()
    
    if (options.fr == 'buy') {
      // carts = app.globalData.dcarts
      selectCarts = app.globalData.dcarts
    }
    for (let i = 0; i < selectCarts.length; i++) {
      total_price += selectCarts[i].num * selectCarts[i].price;
    }
    this.setData({
      config: config,
      carts: carts,
      selectCarts: selectCarts,
      fr: options.fr,
      total_price: total_price
    })
    
    this.showOrderInterface(selectCarts)
    
  },
  showOrderInterface(selectCarts) {
    var that = this 
    var total_amount = that.data.total_price
    var fr = that.data.fr
    var cart = selectCarts
    //var oid = that.data.oid
    app.request({
      url: comm.parseToURL('order', 'showOrderInterface2'),
      data: {
        total_amount: total_amount, 
        cart: JSON.stringify(cart)
      },
      success: function (res) {
        if (res.data.result == 'OK') {
          var usercinfo = res.data.usercinfo
          var total_price = res.data.total_price;
          var delivery_mode = that.data.delivery_mode
          var couponnum = 0
          var coupon_mode = that.data.coupon_mode
          for (var i = 0; i < usercinfo.length; i++) {
            couponnum += parseInt(usercinfo[i]['coupon_num'])
          }
          var tempc = coupon_mode.concat(usercinfo)
          coupon_mode = tempc
          var ujfdata = res.data.ujfdata
          var perdata = res.data.perdata
          if (perdata.limit_type == '2') {
            var limit_point = total_price * perdata.limit_val / 100 * (perdata.redeem_credits / perdata.redeem_money)
            if (limit_point < ujfdata.account_points) {
              ujfdata.account_points = limit_point;
            }
          } else {
            if (parseInt(ujfdata.account_points) > parseInt(perdata.limit_val)) {
              ujfdata.account_points = perdata.limit_val
            }
          }
          if (ujfdata.account_points < 1) ujfdata.account_points = 0
          var integral_mode = that.data.integral_mode
          if (ujfdata.account_points < 1) {
            integral_mode.push(ujfdata.account_points)
          }else if (ujfdata.account_points < 10){
            for (var i = 1; i <= ujfdata.account_points; i += 1) {
              integral_mode.push(i)
            }
          }else{
            for (var i = 10; i <= ujfdata.account_points; i += 10) {
              integral_mode.push(i)
            }
          }
          
          var balance_mode = that.data.balance_mode
          if (ujfdata.account_money < 1) {
            balance_mode.push(ujfdata.account_money)
          }else if (ujfdata.account_money < 10){
            for (var i = 1; i <= ujfdata.account_money; i += 1) {
              balance_mode.push(i)
            }
          }else{
            for (var i = 10; i <= ujfdata.account_money; i += 10) {
              balance_mode.push(i)
            }
          }
          
          var delivery_addr = true
          if(res.data.delivery.length == 0){
            delivery_addr = false
          }
          var disresult = res.data.disresult
          if (disresult){
            for (var i = 0; i < disresult.length; i++ ){
              delivery_mode.push(disresult[i].title)
            }
          }
          that.setData({
            coupon: couponnum,
            ujfdata: ujfdata,
            perdata: perdata,
            integral_mode: integral_mode,
            balance_mode: balance_mode,
            coupon_mode: coupon_mode,
            lastPrice: total_price,
            total_price: total_price,
            MessageSwitch: res.data.MessageSwitch,
            TextModification: res.data.TextModification,
            address: res.data.delivery,
            delivery_addr: delivery_addr,
            delivery_mode: delivery_mode,
            disresult: disresult,
            weight: res.data.weight,
            pickupaddrs: res.data.pickupaddrs
          })
        }else{
          wx.navigateBack({})
        }
      }
    })
  },
  onShow: function () {
    if (typeof (this.options.fr) =='undefined'){
      wx.switchTab({
        url: '../user_new/user_new',
      })
    }
    let start_date=util.formatTime2(new Date);
    let end_date = util.formatTime3(new Date);
    this.setData({
      start_date: start_date,
      date: start_date,
      end_date: end_date
    })
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        if (res.data) {
          self.setData({
            delivery_addr: true,
            address: res.data
          })
        } else {
          self.setData({
            delivery_addr: false
          })
        }
      }
    })
  },
  binkInvoiceText(e){
    this.setData({
      invoice: e.detail.value
    })
  }
})




