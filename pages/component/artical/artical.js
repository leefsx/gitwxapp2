
var config = require('../../../common/config.js');



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
          })
          wx.getSystemInfo({
            success: function (res) {
              console.log(res.windowWidth + 'px')
              li_width = res.windowWidth/750*210
              console.log(li_width)
              that.setData({
                li_width:li_width,
                deviceWidth: res.windowWidth,
                deviceHeight: res.windowHeight,
              })
            }
          })
        
          bar.getCategory(this)
          this.getArticlesFromServer(10,1)
      },
    onLoad(options) {
        if (options.activeIndex) {
            var that = this;
            that.setData({
                activeIndex: options.activeIndex
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
        const li_width = this.data.li_width
        let scrollLeft = this.data.scrollLeft
        if (scrollLeft > li_width){
            this.setData({
              scrollLeft: scrollLeft - li_width
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
        console.log(this.data.scrollLeft+"d")
    },
    
    arrowPlus(e){
        const li_width = this.data.li_width
        let ul_length = this.data.articalUl.length
        let scrollLeft = this.data.scrollLeft;
        // let scrollNum = this.data.scrollNum;
        console.log(ul_length)
        scrollLeft += li_width
        if (scrollLeft >= (li_width * (ul_length-3))){
          this.setData({
            scrollLeft: (li_width * (ul_length - 3))
          })
        } else {
          this.setData({
            scrollLeft: scrollLeft
          })
        }
        console.log(this.data.scrollLeft + "a")
    },
    oTs: function (e) {
      var m = this;
      m._x = e.touches[0].clientX;
    },
    oTe: function (e) {
      const li_width = this.data.li_width
      let ul_length = this.data.articalUl.length
      let scrollLeft = this.data.scrollLeft;
      var m = this;
      m._new_x = e.changedTouches[0].clientX;
      if (m._new_x - m._x < (li_width+20) && m._new_x - m._x > 20){
        scrollLeft -= li_width
        if (scrollLeft<0){
          this.setData({
            scrollLeft: 0
          })
        } else{
          this.setData({
            scrollLeft: scrollLeft
          })
        }
      } else if (m._new_x - m._x > (li_width+20) ){
        scrollLeft -= (2 * li_width)
        if (scrollLeft < 0) {
          this.setData({
            scrollLeft: 0
          })
        } else {
          this.setData({
            scrollLeft: scrollLeft
          })
        }
      } else if (m._new_x - m._x < 20 && m._new_x - m._x > -20){
        this.setData({
          scrollLeft : scrollLeft
        })
      } else if (m._new_x - m._x < -20 && m._new_x - m._x > -(li_width+20)) {
        scrollLeft += li_width
        if (scrollLeft >= (li_width * (ul_length - 3))) {
          this.setData({
            scrollLeft: (li_width * (ul_length - 3))
          })
        } else {
          this.setData({
            scrollLeft: scrollLeft
          })
        }
      } else if (m._new_x - m._x < -(li_width+20)) {
        scrollLeft += 2 * li_width
        if (scrollLeft >= (li_width * (ul_length - 3))) {
          this.setData({
            scrollLeft: (li_width * (ul_length - 3))
          })
        } else {
          this.setData({
            scrollLeft: scrollLeft
          })
        }
      }
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
            console.log(res.data.category)
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