// page/component/new-pages/user/address/address.js
import { Promise } from '../../../utils/util-2';
var comm = require('../../../common/common.js');
var config = require('../../../common/config.js');

/**
 *  查询接口
 */
const API = 'https://lishifeng2.mywopop.com/api/user/basearea?pid=';
var app = getApp()
Page({
  data:{
    config:[],
    message:{
      name:'',
      phone:'',
      detail:'',
      address:''
    },
    isShow:false,
    areaname: [],
    uid: 0
  },
  formSubmit(){
    var self = this;
    var uid = self.data.uid
    if(self.data.address.name && self.data.address.phone && self.data.address.detail){
      app.request({
        url: comm.parseToURL('user','delivery_address'),
        data: { 
          address: JSON.stringify(self.data.address), 
          uid: uid
        },
        success: function(res){
          if(res.data.result == 'OK'){
            wx.showToast({
              title: '保存成功'
            })
            wx.navigateBack();
          }else{
            wx.showToast({
              title: '保存失败'
            })
          }
        }
      })
      
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
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
  bindName(e){
    this.setData({
      'message.name' : e.detail.value
    })
  },
  bindPhone(e){
    this.setData({
      'message.phone' : e.detail.value
    })
  },
  bindDetail(e){
    this.setData({
      'message.detail' : e.detail.value
    })
  },
  bindAddress(e){
    this.setData({
      'message.address' : e.detail.value
    })
  },

















})