var config = require('../../../common/config.js');
var comm = require('../../../common/common.js');
var WxParse = require('../../../common/wxParse.js');
var app = getApp()
Page({
    data: {
        config:[],
        prompt: {
            hidden: !0,
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
        articalUl:["企业服务","售后服务","配送说明","购物指南"],
        article: []
    
    },
    onShow: function () {
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