// page/component/details/details.js
var WxParse = require('../../../common/wxParse.js');
var comm = require('../../../common/common.js');
var config = require('../../../common/config.js');
var bar = require('../../common/bar.js');
var app = getApp();
Page({
  data: {
    category_info: {
      category: [],
      isShowBar: false
    },
    product_id: '',
    detail_data: [],
    detail_desc: '',
    carts:[],

    fir_ord: 0,
    sec_ord: 0,
    good_ord: 0,
    curIndex: 0,
    duration: 500,
    currentState: false,
    propertys:[
    ],
    food: {
      "name": "坚果零食大礼包",
      "good_ord": "0",
      "fir_ord": "0",
      "sec_ord": "1",
      "url": "/image/o1.jpg",
      "old_price": "￥150",
      "price": "￥150",
      "dec": "一份价钱，尽享10种零",
      "total_count": 200,
      "num": 1,
      "dec_detail": {
      }
    },
    tradeRate: [],
    salesRecords: [],
    productMessage: [],
    prevnext: [],
    attr_data: [],
    skulist: [],
    config: []

  },
  comeBackToFirst(){
    wx.switchTab({
      url: '../index',
    })
  },
  onShow(){
    bar.getCategory(this)
    bar.hideBar(this)
  },
  barSwitchTab(e){
    bar.barSwitchTab(e,this)
  },
  showBar() {
    bar.showBar(this)
  },
  hideBar() {
    bar.hideBar(this)
  },
  switchDetState(e){
    let propertys = this.data.propertys;
    const idx = parseInt(e.currentTarget.dataset.index);
    const id = parseInt(e.currentTarget.dataset.id);
    const pid = parseInt(e.currentTarget.dataset.pid);
    const did = parseInt(e.currentTarget.dataset.did);
    var attr_data = this.data.attr_data;
    var skulist = this.data.skulist
    var detail_data = this.data.detail_data
    if (propertys[id].details[idx].detail_state != "disable" && propertys[id].details[idx].detail_state != "active") {
      propertys[id].details.forEach(function (e) {
        if (e.detail_state == "active") {
          e.detail_state = "";
        }
      })
      propertys[id].details[idx].detail_state = "active"
    }
    
    attr_data[id] = pid+':'+did
    if (attr_data.length > 0 && attr_data.length == propertys.length){
      var attr_str = attr_data.join(';')
      var skuid = skulist[attr_str]
      
      detail_data.price = skuid.price
      detail_data.num = skuid.quantity
      detail_data.skuid = skuid.id
    }
    this.setData({
      propertys: propertys,
      attr_data: attr_data,
      detail_data: detail_data
    })
  },
  changState() {
    this.setData({
      currentState: (!this.data.currentState)
    })
  },
  addCount() {
    
    let food = this.data.food;
    let num = food.num;
    const count = food.total_count;
    if (num >= count) {
      return false;
    }
    num = num + 1;
    food.num = num;
    this.setData({
      food: food
    });
  },

  minusCount() {
    let food = this.data.food;
    let num = food.num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    food.num = num;
    this.setData({
      food: food
    });
  },
  toCart() {
    var that = this;
    var carts = that.data.carts
    var cart_index = carts.length
    var detail_data = that.data.detail_data
    var skulist = that.data.skulist
    var attr_data = that.data.attr_data;
    var hadInCart = false
    if (skulist && Object.keys(skulist).length > 0 && attr_data.length == 0){
      that.setData({
        currentState: (!that.data.currentState)
      })
    }else{
      wx.showLoading({
        title: '请求中',
        mask: true
      })
      if (cart_index > 0) {
        for (var i = 0; i < cart_index; i++) {

          if (carts[i].cid == detail_data.id) {
            carts[i].sum = detail_data.price;
            carts[i].price = detail_data.price;
            carts[i].num += that.data.food.num;
            carts[i].skuid = detail_data.skuid || 0;
            hadInCart = true
          }
        }

      }
      if (hadInCart == false) {
        var send_data = {
          cid: detail_data.id,
          title: detail_data.name,
          image: detail_data.feature_img[0],
          num: that.data.food.num,
          price: detail_data.price,
          sum: detail_data.price,
          selected: true,
          max_kc: detail_data.num,
          skuid: detail_data.skuid || 0
        }
        carts.push(send_data)
      }
      app.globalData.carts = carts
      wx.switchTab({
        url: '../cart/cart',
      })
    }
    
  },
  toConfirm(){
    var that = this
    var detail_data = that.data.detail_data
    var skulist = that.data.skulist
    var attr_data = that.data.attr_data;
    if (skulist && Object.keys(skulist).length > 0 && attr_data.length == 0) {
      that.setData({
        currentState: (!that.data.currentState)
      })
    } else {
      wx.showLoading({
        title: '请求中',
        mask: true
      })
      var carts = [{
        cid: detail_data.id,
        title: detail_data.name,
        image: detail_data.feature_img,
        num: that.data.food.num,
        price: detail_data.price,
        sum: detail_data.price,
        selected: true,
        max_kc: detail_data.num,
        skuid: detail_data.skuid
      }]
      comm.get_cuser({
        success: function (cuser) {
          var that = this
          if (cuser == false) {
            wx.showToast({
              title: '请先登录'
            })
            wx.navigateTo({
              url: '../login/login'
            })
          } else {
            app.request({
              url: comm.parseToURL('order', 'createOrder'),
              data: { 
                fr: 'buy',
                cart: JSON.stringify(carts) 
              },
              method: 'GET',
              success: function (ress) {
                wx.hideLoading()
                if (ress.data.result == 'OK') {
                  app.globalData.dcarts = carts
                  var oid = ress.data.oid
                  wx.navigateTo({
                    url: '../order_confirm/order_confirm?t=detail&fr=u&oid=' + oid
                  })
                } else {
                  wx.showToast({
                    title: ress.data.errmsg
                  })
                }
              }
            })
          }
        }
      })
      
      //wx.switchTab({
      //  url: '../cart/cart',
      //})
    }
    
  },
  onLoad(options){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    comm.get_cuser({
      success: function (cuser) {}
    })
    if (!options.id) options.id = app.globalData.firstPid
    if (options.id) {
      var that = this;
      that.setData({
        carts: app.globalData.carts,
        config: config
      })
      app.request({
        url: app.domain + '/api/product/detail',
        dataType: 'json',
        data: {
          id: options.id
        },
        method: 'GET',
        success: function (res) {
          var detail = res.data.data.description;
          WxParse.wxParse('detail_desc', 'html', detail, that, 0);
          
          that.setData({
            detail_data: res.data.data,
            product_id: options.id,
            tradeRate: res.data.tradeRate,
            salesRecords: res.data.salesRecords,
            productMessage: res.data.productMessage,
            prevnext: res.data.PrevNext,
            propertys: res.data.newsku,
            skulist: res.data.skulist
          })
          
        },
        fail: function () {
          console.log('fail');
        },
        complete: function () {
          console.log('complete!');
          wx.hideLoading()
        }
      })

    } else {
      wx.navigateBack()
    }
  },


  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    
    this.setData({
      curIndex: index
    })
  },

  currentChange(e) {
    
    this.setData({
      curIndex: e.detail.current
    })
  },


  oTs: function (e) {
    var m = this;
    m._x = e.touches[0].clientX;
  },
  oTe: function (e) {
    var m = this;
    var curIndex = parseInt(this.data.curIndex);

    m._new_x = e.changedTouches[0].clientX;

    if (m._new_x - m._x > 100 && curIndex > 0) {
      curIndex = curIndex - 1;
    }

    if (m._new_x - m._x < -100 && curIndex < 3) {
      curIndex += 1;
    }

    this.setData({
      curIndex: curIndex
    });
  },
  prevnext(e) {
    var id = e.target.dataset.id
    if(id){
      wx.navigateTo({
        url: '../details/details?id=' + id
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: config.logo_title +' '+ this.data.detail_data['name'],
      path: 'pages/component/details/details?id=' + this.data.product_id
    }
  }

})