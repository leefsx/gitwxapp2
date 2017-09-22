var config = require('../../../common/config.js');
var bar = require('../../common/bar.js');

var app = getApp()
Page({
  data: {
    category_info: {
      category: [],
      isShowBar: false
    },
    products: [],
    category: [],
    category_name: "所有商品",
    website_name: '',
    scrollTop: 0,
    IsEnd: false,
    goods: [
      {
        "first_level_category": "坚果炒货2",
        "fir_ord": "1",
        "content": [
          {
            "second_level_category": "碧根果",
            "sec_ord": "0",
            "good": []
          }
        ]
      }
    ],
    detail: [],
    curFirIndex: 0,
    curSecIndex: 0,
    product_category: 0,
    list_page: 1,
    curIndex: '',
    prompt: {
      hidden: true,
    },
    config: [],
    deviceHeight: '',
    loading: false,
    detail_data: [],
    carts: [],
    currentState: false,
    product_id: '',
    propertys: [],
    skulist: [],
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
    attr_data: [],
    tradeRate: [],
    salesRecords: [],
    productMessage: [],
    prevnext: []
  },
  showBar(){
    bar.showBar(this)
  },
  hideBar() {
    bar.hideBar(this)
  },
  initCart() {
    this.setData({
      detail_data: [],
      currentState: false,
      product_id: '',
      propertys: [],
      skulist: [],
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
      attr_data: []
    }) 
  },
  directAddCart(e) {
    var that = this
    var itemId = e.currentTarget.dataset.id;
    console.log(itemId)
    app.request({
      url: app.domain + '/api/product/detail',
      dataType: 'json',
      data: {
        id: itemId
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          detail_data: res.data.data,
          product_id: itemId,
          tradeRate: res.data.tradeRate,
          salesRecords: res.data.salesRecords,
          productMessage: res.data.productMessage,
          prevnext: res.data.PrevNext,
          propertys: res.data.newsku,
          skulist: res.data.skulist
        })
        console.log(res.data.data)
        var carts = that.data.carts
        var cart_index = carts.length
        var detail_data = res.data.data
        var skulist = res.data.skulist
        var attr_data = that.data.attr_data;
        var hadInCart = false
        var propertys = res.data.newsku;
        // var isFull = true
        // var currentState = this.data.currentState
        // for (var i = 0; i < attr_data.length; i++) {
        //   console.log(1)
        //   if (attr_data[i] == '' || attr_data[i] == undefined || attr_data.length < propertys.length) {
        //     isFull = false
        //     break
        //   }
        //   isFull = true
        // }
        if (skulist && Object.keys(skulist).length > 0 ) {
          console.log('m')
          that.setData({
            currentState: (!that.data.currentState)
          })
        } else {
          console.log('n')
          wx.showLoading({
            title: '请求中',
            mask: true
          })
          // if (cart_index > 0) {
          //   for (var i = 0; i < cart_index; i++) {

          //     if (carts[i].cid == detail_data.id) {
          //       carts[i].sum = detail_data.price;
          //       carts[i].price = detail_data.price;
          //       carts[i].num += that.data.food.num;
          //       carts[i].skuid = detail_data.skuid || 0;
          //       hadInCart = true
          //     }
          //   }
          // }
          if (cart_index > 0) {
            for (var i = 0; i < cart_index; i++) {
              if (detail_data.skuid && carts[i].cid == detail_data.id && carts[i].skuid == detail_data.skuid) {
                carts[i].num += that.data.food.num;
                hadInCart = true
              } else if (!detail_data.skuid && carts[i].cid == detail_data.id) {
                carts[i].num += that.data.food.num;
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
          wx.showToast({
            title: '添加成功'
          })

          that.initCart()
        }
        // console.log(that.data.skulist)
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete!');
      }
    })
  },
  directAddCartOK() {
    var that = this
    var carts = that.data.carts
    var cart_index = carts.length
    var detail_data = that.data.detail_data
    var skulist = that.data.skulist
    var attr_data = that.data.attr_data;
    var hadInCart = false
    var propertys = that.data.propertys
    var isFull = true
    var food = that.data.food
    var num = parseInt(food.num)
    if (attr_data.length == 0) {
      isFull = false
    } else {
      for (var i = 0; i < attr_data.length; i++) {
        console.log(1)
        if (attr_data[i] == '' || attr_data[i] == undefined || attr_data.length < propertys.length) {
          isFull = false
          break
        }
        isFull = true
      }
    }
    if (!isFull) {
      wx.showToast({
        title: '请选择商品属性'
      })
    } else {
      wx.showLoading({
        title: '请求中',
        mask: true
      })
      if (cart_index > 0) {
        // var cartNum = 0
        for (var i = 0; i < cart_index; i++) {
          if (detail_data.skuid && carts[i].cid == detail_data.id && carts[i].skuid == detail_data.skuid) {
            console.log(carts[i].num)
            var cartNum = parseInt(carts[i].num)
            carts[i].num = cartNum += num;
            hadInCart = true
          } else if (!detail_data.skuid && carts[i].cid == detail_data.id) {
            var cartNum = parseInt(carts[i].num)
            carts[i].num = cartNum += num;
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
      wx.showToast({
        title: '添加成功'
      })
      that.initCart()
    }
    
  },
  switchDetState(e) {
    let propertys = this.data.propertys;
    const idx = parseInt(e.currentTarget.dataset.index);
    const id = parseInt(e.currentTarget.dataset.id);
    const pid = parseInt(e.currentTarget.dataset.pid);
    const did = parseInt(e.currentTarget.dataset.did);
    var attr_data = this.data.attr_data;
    var skulist = this.data.skulist
    var detail_data = this.data.detail_data
    var isFull = true
    if (propertys[id].details[idx].detail_state != "disable" && propertys[id].details[idx].detail_state != "active") {
      propertys[id].details.forEach(function (e) {
        if (e.detail_state == "active") {
          e.detail_state = "";
        }
      })
      propertys[id].details[idx].detail_state = "active"
    }

    attr_data[id] = pid + ':' + did
    for (var i = 0; i < attr_data.length; i++) {
      console.log(1)
      if (attr_data[i] == '' || attr_data[i] == undefined) {
        isFull = false
        break
      }
      isFull = true
    }
    if (attr_data.length > 0 && attr_data.length == propertys.length && isFull) {
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
    this.initCart()
  },
  addCount() {

    let food = this.data.food;
    let num = food.num;
    let detail_data = this.data.detail_data
    const count = parseInt(detail_data.num);
    console.log(count)
    num = num + 1;
    if (num > count) {
      num = parseInt(count);
      wx.showToast({
        title: '数量超出范围~'
      })
    }
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
  
  onShow(){
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
            deviceWidth: res.windowWidth, 
            deviceHeight: res.screenHeight, 
        })
      }
    })
    var product_category = app.globalData.cateid || 0
    var category_name = app.globalData.catename || "所有商品"
    app.globalData.cateid = 0
    app.globalData.catename = "所有商品"
    this.setData({
      carts: app.globalData.carts,
      config: config,
      product_category: product_category,
      curIndex: '',
      category_name: category_name,
      products: []
    })
      this.getProductsFromServer(6, 1)
      wx.stopPullDownRefresh()
      bar.getCategory(this)
      bar.hideBar(this)
    
  },
  barSwitchTab(e) {
    var that = this
    var cateid = e.currentTarget.dataset.id;
    var category_name = e.currentTarget.dataset.name;
    var curIndex = e.currentTarget.dataset.index;
    that.setData({
      curIndex: curIndex,
      category_name:category_name
    })
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        list_num: 6,
        product_category: cateid
      },
      method: 'GET',
      success: function (res) {
        var resdata = []
        if (res.data.result=='OK'){
          resdata = res.data.data
        }
        that.setData({
          products: resdata,
          product_category: cateid,
          curIndex: curIndex,
          'prompt.hidden': resdata.length,
          'category_info.isShowBar':false
        })
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete!');
      }
    })
  },
  onPullDownRefresh() {
    this.getProductsFromServer(6, 1)
    wx.stopPullDownRefresh()
  },
  getProductsFromServer(list_num, page) {
    var that = this;
    var product_category = that.data.product_category
    that.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        list_num: list_num,
        product_category: product_category,
        p: page
      },
      method: 'GET',
      success: function (res) {
        if (res.data.result == 'OK') {
          wx.hideLoading()
          var resdata = res.data.data
          if (page > 1 && resdata.length > 0) {
            var this_products = that.data.products
            this_products = this_products.concat(resdata)
          }else{
            var this_products = resdata
          }
          that.setData({
            products: this_products,
            website_name: config.website_name,
            'prompt.hidden':resdata.length,
            list_page: page,
            loading: false
          })

        } 
        if (that.data.products.length==0){
          that.setData({
            'prompt.hidden':false
          })
        }
      },
      fail: function () {
        console.log('fail');
        
      },
      complete: function () {
        console.log('complete!');
        if (that.data.products.length>0 && that.data.loading){
          wx.showToast({
            title: '已加载到最后'
          })
          that.setData({
            IsEnd: true
          })
        }
      }
    })
  },
  load_more() {
    var this_page = this.data.list_page
    if (this_page > 0) {
      this.getProductsFromServer(6, this_page + 1)
    }
  },
  reachBottom() {
    if (!this.data.loading) {
      this.load_more()
    }
  },
  lower(){
    console.log(110)
    if (!this.data.loading) {
      this.load_more()
    }
  },
  onReachBottom: function(){
    if (!this.data.loading) {
      this.load_more()
    }
  }

})