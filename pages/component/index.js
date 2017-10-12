var comm = require('../../common/common.js');
var config = require('../../common/config.js');
var WxParse = require('../../common/wxParse.js');
var bar = require('../common/bar.js');
var app = getApp();
Page({
  data: {
    category_info:{
      category:[],
      isShowBar:false
    },
    imgUrls: [],
    products:[],
    goodsXX: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    website_name: '',
    list_page: 1,
    index_middle_img: [],
    index_middle2_img: '',
    config: [],
    product1:[],
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
  onLoad() {
    var that = this
    var param = {
      type: 'all',
      list_num: 16
    }
    that.getFloorProduct({
      data: param,
      success: function (res) {
        if (res) {
          that.setData({
            product1: res.slice(0, 3),
            product2: res.slice(3, 7),
            product3: res.slice(7, 11),
            product4: res.slice(11, 15)
          })
        }
      }
    })

  },
  barSwitchTab(e) {
    bar.barSwitchTab(e, this)
  },
  showBar() {
    bar.showBar(this)
  },
  hideBar() {
    bar.hideBar(this)
  },
  onShow: function () {
    var that = this
    app.globalData.hadInLoginPage = false
    that.setData({
        imgUrls: config.index_autoplay_img,
        config: config,
        index_autoplay_imgurl: config.index_autoplay_imgurl
      })
    bar.getCategory(this)
    setTimeout(function(){
      that.getSectionPro()
    },50)
    bar.hideBar(this)
    
  },
  toCategory(){
    wx.switchTab({
      url: 'category/category',
    })
  },
  onPullDownRefresh(){
    var list_page = this.data.list_page
    var list_num = 6 * (list_page)
    this.getProductsFromServer(list_num, 1)
    wx.stopPullDownRefresh()
  },
  load_more(){
    var this_page = this.data.list_page
    if (this_page>0){
      var new_list = this.getProductsFromServer(6, this_page+1)
    }
  },
  // onReachBottom() {
  //       this.load_more()
  // },
  getProductsFromServer(list_num, page) {
    var that = this;
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        list_num: list_num,
        product_category: 0,
        p: page
      },
      method: 'GET',
      success: function (res) {
        // console.log(res)
        var resdata = res.data.data
        if (page > 1 && resdata.length > 0) {
          var this_products = that.data.products
          this_products = this_products.concat(resdata)
          that.setData({
            products: this_products,
            list_page: page
          })
          
          return resdata;
        }else{
          that.setData({
            products: resdata,
            website_name: config.website_name
          })
          if (resdata.length > 0) {
            app.globalData.firstPid = resdata[0].id
          }
        }
        
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete!');
      }
    })
  },
  tocategory(opt){
    var cindex = opt.currentTarget.dataset.index
    var type = opt.currentTarget.dataset.type
    var imgdata = []
    if (type == 'index_autoplay_imgurl') {
      imgdata = config.index_autoplay_imgurl
    } else if (type == 'pagenav_imgurl') {
      imgdata = config.pagenav_imgurl
    } else if (type == 'logourl') {
      imgdata[0] = config.logourl
    } else if (type == 'navarticle_url') {
      imgdata[0] = config.navarticle_urlurl
    }
    if (typeof(imgdata[cindex]['category_id'])!='undefined'){
      app.globalData.cateid = imgdata[cindex]['category_id']
      //app.globalData.catename = 
      wx.switchTab({
        url: 'category/category'
      })
    } else if (typeof(imgdata[cindex]['detail_id'])!='undefined'){
      wx.navigateTo({
        url: 'details/details?id=' + imgdata[cindex]['detail_id'],
      })

    } else if (typeof(imgdata[cindex]['article_cid'])!='undefined') {
      wx.navigateTo({
        url: 'article/article?id=' + imgdata[cindex]['article_cid'],
      })

    } else if (typeof(imgdata[cindex]['article_did'])!='undefined') {
      wx.navigateTo({
        url: 'article-detail/article-detail?id=' + imgdata[cindex]['article_did'],
      })

    }
    
  },
  onShareAppMessage: function () {
    return {
      title: config.logo_title,
      path: 'pages/component/index'
    }
  },
  getFloorProduct: function (obj){
    var that = this
    var data = obj.data
    if (data.type == 'all'){
      var ids = ''
      var list_num = data.list_num
    }else{
      if (data.ids) {
        var ids = data.ids
        var ids_arr = ids.split(',')
        var list_num = ids_arr.length
      }else{
        return false
      }
    }
    
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        ids: ids,
        list_num: list_num
      },
      success: function(res){
        if (res.data.result == 'OK') {
          typeof obj.success == "function" && obj.success(res.data.data)
        }else{
          typeof obj.success == "function" && obj.success(false)
        }
      }
    })
  },
  getSectionPro(){
    var that = this
    if (config.dailyoffice_display == 'true' && config.dailyoffice_datasource) {
      var datasource = { ids: config.dailyoffice_datasource }
      this.getFloorProduct({
        data: datasource,
        success: function (res) {
          if (res) {
            that.setData({
              product1: res
            })
          }
        }
      })
    }
    if (config.writingtools_display == 'true' && config.writingtools_datasource) {
      var datasource = { ids: config.writingtools_datasource }
      this.getFloorProduct({
        data: datasource,
        success: function (res) {
          if (res) {
            that.setData({
              product2: res
            })
          }
        }
      })
    }
    if (config.paperin_display == 'true' && config.paperin_datasource) {
      var datasource = { ids: config.paperin_datasource }
      this.getFloorProduct({
        data: datasource,
        success: function (res) {
          if (res) {
            that.setData({
              product3: res
            })
          }
        }
      })
    }
    if (config.learningsupply_display == 'true' && config.learningsupply_datasource) {
      var datasource = { ids: config.learningsupply_datasource }
      this.getFloorProduct({
        data: datasource,
        success: function (res) {
          if (res) {
            that.setData({
              product4: res
            })
          }
        }
      })
    }
  },
  // 直接添加到购物车--开始
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
        if (skulist && Object.keys(skulist).length > 0) {
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
// 直接添加到购物车--结束

})