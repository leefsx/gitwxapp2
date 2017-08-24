var config = require('../../../common/config.js');
var bar = require('../../common/bar.js');

var app = getApp()
Page({
  data: {
    category_info: {
      category: [],
      isShowBar: false
    },
    products:[],
    category: [],
    category_name:"所有商品",
    website_name: '',
    scrollTop: 0,
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
    prompt:{
      hidden:true,
    },
    config: [],
    deviceHeight:'',
    loading: false
  },
  showBar(){
    bar.showBar(this)
  },
  hideBar() {
    bar.hideBar(this)
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
      config: config,
      product_category: product_category,
      curIndex: '',
      category_name: category_name,
      products: []
    })
    
    //if (this.data.products.length<1){
      this.getProductsFromServer(6, 1)
      wx.stopPullDownRefresh()
      bar.getCategory(this)
    //}
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