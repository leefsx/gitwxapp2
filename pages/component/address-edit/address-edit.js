// page/component/new-pages/user/address/address.js
var comm = require('../../../common/common.js');
const app = getApp()
Page({
  data:{
    address:{
      name:'',
      phone:'',
      detail:'',
      is_def:''
    }
  },
  onLoad(opt){
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          address : res.data
        })
      }
    })
  },
  formSubmit(){
    var self = this;
    if(self.data.address.name && self.data.address.phone && self.data.address.detail){
      wx.setStorage({
        key: 'address',
        data: self.data.address,
        success(){
          wx.navigateBack();
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
  // getLocation(){
  //   wx.getLocation({
  //     success: function(res) {},
  //   })
  // },
  bindName(e){
    this.setData({
      'address.name' : e.detail.value
    })
  },
  toBack(){
    wx.navigateBack({
      delta: 1
    })
  },
  bindPhone(e){
    this.setData({
      'address.phone' : e.detail.value
    })
  },
  bindDetail(e){
    this.setData({
      'address.detail' : e.detail.value
    })
  },
  switchChange(e){
    this.setData({
      'address.is_def' : e.detail.value
    })
  },
  onCancel(){
    this.setData({
      'address.povince' : '',
      isShow : false
    })
  },
  onConfirm(){
    this.setData({
      isShow : false
    })
  }
})