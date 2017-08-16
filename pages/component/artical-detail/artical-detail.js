
var config = require('../../../common/config.js');
Page({
    data: {
        config:[],
        prompt: {
            hidden: !0,
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
        articalUl:["企业服务","售后服务","配送说明","购物指南"]
    
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
        
      },
})