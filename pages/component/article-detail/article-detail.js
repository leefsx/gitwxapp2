var config = require('../../../common/config.js');
var comm = require('../../../common/common.js');
var WxParse = require('../../../common/wxParse.js');
var bar = require('../../common/bar.js');
var art_bar = require('../../common/article_bar.js');
var app = getApp()
Page({
    data: {
        config:[],
        article: [],
        activeIndex: 0,
        scrollLeft:0,
        articalUl:[],
        li_width:0,
        category_info: {
          category: [],
          isShowBar: false
        }
    
    },
    onShow: function () {
      let li_width = this.data.li_width
      let that= this
      bar.getCategory(this)
      wx.getSystemInfo({
        success: function (res) {
          li_width = res.windowWidth/750*210
          that.setData({
            li_width:li_width,
            deviceWidth: res.windowWidth,
            deviceHeight: res.windowHeight,
          })
        }
      })
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
    changActive(e){
      const id = parseInt(e.currentTarget.dataset.id);
      this.setData({
          activeIndex: id
      })
      wx.navigateTo({
        url:"/pages/component/article/article?id="+id
      })
    },
    onLoad(opt){
      var that = this
      app.request({
        url: comm.parseToURL('article', 'detail'),
        data: {
          id: opt.id || 0
        },
        success: function (res) {
          if (res.data.result == 'OK') {
            var content = res.data.data.content;
            res.data.data.content = ''
            WxParse.wxParse('content', 'html', content, that, 0);
            that.setData({
              article: res.data.data
            })
          } else {
            wx.showToast({
              title: '参数错误',
            })
          }
        }
      })
      that.setData({
        config: config,
      })
      this.getArticleCategory()

    },
    arrowMinus(){
      art_bar.arrowMinus(this)
    },
    arrowPlus(){
      art_bar.arrowPlus(this)
    },
    oTs: function (e) {
      art_bar.oTs(e,this)
    },
    oTe: function (e) {
      art_bar.oTe(e,this)
    },
    getArticleCategory(){
      var that = this
      app.request({
        url: comm.parseToURL('article', 'list'),
        data: {

        },
        success: function (res) {
          if (res.data.result == 'OK') {
            that.setData({
              articalUl: res.data.category
            })
          } else {

          }
        } 
      })     
    }
})