var comm = require('../../common/common.js');
var config = require('../../common/config.js');
var WxParse = require('../../common/wxParse.js');
var app = getApp();
Page({
  data: {
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
    config: []
  },
  onLoad() {
    
  },
  onShow: function () {
    this.getProductsFromServer(6, 1),
      this.setData({
        imgUrls: config.index_autoplay_img,
        index_middle_img: config.index_middle_img,
        index_middle2_img: config.index_middle2_img,
        config: {
          'website_name': config.website_name,
          'logo': config.logo,
          'hotline_logo': config.hotline_logo,
          'hotline_no': config.hotline_no,
          'copyright': config.copyright,
          'product_title': config.product_title,
          'index_middle_title': config.index_middle_title,
          'logourl': config.logourl
        },
        index_autoplay_imgurl: config.index_autoplay_imgurl,
        index_middle_imgurl: config.index_middle_imgurl
      })
    
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
    var cateid = opt.target.dataset.id
    if (cateid){
      app.globalData.cateid = cateid
      wx.switchTab({
        url: 'category/category'
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: config.website_name,
      path: 'pages/component/index'
    }
  }

})