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
    product1:[]
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
  }

})