
var config = require('../../../common/config.js');
var comm = require('../../../common/common.js');
var app = getApp();
Page({
    data: {
        activeIndex: 0,
        config:[],
        prompt: {
            hidden: !0,
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
        articalUl:[],
        article: []
       
    },
    onShow: function () {
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
    changActive(e){
        const id = parseInt(e.currentTarget.dataset.id);
        this.setData({
            activeIndex: id
        })
        this.getArticlesFromServer(10, 1)
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
            console.log(res.data.data)
            that.setData({
              article: res.data.data,
              articalUl: res.data.category
            })
          } else {

          }
        }
      })
    }
})