
var config = require('../../../common/config.js');
var art_bar = require('../../common/article_bar.js');


var comm = require('../../../common/common.js');
var bar = require('../../common/bar.js');
var app = getApp();

Page({
    data: {
        category_info: {
          category: [],
          isShowBar: false
        },
        activeIndex: 0,
        config:[],
        prompt:{
          hidden:true,
        },
        scrollLeft:0,
        scrollNum:0,
        li_width:0,
        articalUl:[],
        article: []   
    },
    onShow: function () {
          let li_width = this.data.li_width
          let that= this
          this.setData({
            config: config,
          })
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
        
          bar.getCategory(this)
          this.getArticlesFromServer(10,1)
          bar.hideBar(this)
      },
    onLoad(options) {
      var aid = ''
      if (options.id) aid = options.id
      else if (options.activeIndex) aid = options.activeIndex
        if (aid) {
            var that = this;
            that.setData({
                activeIndex: aid,
                // intoView:'a'+aid
            })
        }
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
        this.getArticlesFromServer(10, 1)

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
    getArticlesFromServer(list_num, page) {
      var that = this
      var article_category = that.data.activeIndex
      app.request({
        url: comm.parseToURL('article', 'list'),
        data: {
          list_num: list_num,
          page: page,
          article_category: article_category
        },
        success: function (res) {
          if (res.data.result == 'OK') {
            that.setData({
              article: res.data.data,
              articalUl: res.data.category,
              'prompt.hidden' : res.data.data.length
            })
          } else {

          }
        }
      })
    }
})