var config = require('../../../common/config.js');
var comm = require('../../../common/common.js');
var WxParse = require('../../../common/wxParse.js');
var bar = require('../../common/bar.js');
var app = getApp()
Page({
    data: {
        config:[],
        articalUl:["企业服务","售后服务","配送说明","购物指南"],
        article: [],
        category_info: {
          category: [],
          isShowBar: false
        }
    
    },
    onShow: function () {
      bar.getCategory(this)
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
            console.log(content)
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

    }
})