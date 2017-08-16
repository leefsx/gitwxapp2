var comm = require('../../../common/common.js');
var config = require('../../../common/config.js');
var app = getApp()
Page({
  data: {
    foods:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true,    // 全选状态，默认全选
    jsStatus: false,
    totleNum: 0,
    prompt: {
      hidden: false,
      icon: '../../../image/asset-img/iconfont-cart-empty.png',
      title: '购物车空空如也',
      text: '来挑几件好货吧',
      buttons: [
        {
          text: '随便逛',
          bindtap: 'bindtap',
        },
      ],
    },
  },
  bindtap(){
    wx.switchTab({
      url: '../category/category',
    })
  },
  onShow() {
    var openid = wx.getStorageSync('openid');
    this.setData({
      foods: app.globalData.carts,
      config:{
        'website_name': config.website_name
      }
    })
    if (app.globalData.carts.length){
      var cart_num = app.globalData.carts.length
      if (cart_num > 0) {
        this.setData({
          'prompt.hidden': app.globalData.carts.length
        });
        this.isSelectAll();
        this.getTotalPrice();
      }
      
    }else{
      this.setData({
        'prompt.hidden': false
      });
    }
  },

  toConfirm() {
    var cartItems = this.data.foods
    if (!cartItems || cartItems.length === 0) {
      wx.hideToast()
      wx.showModal({
        title: '未选购商品',
        content: '您需要将商品加入购物车后才能支付',
        showCancel: false,
        success: function (res) { }
      })
      return
    }
    wx.showLoading({
      title: '请求中',
      mask: true
    })
    comm.get_cuser({
      success:function(cuser){
        var that = this
        if (cuser == false) {
          wx.showToast({
            title: '请先登录'
          })
          wx.navigateTo({
            url: '../login/login'
          })
        } else {
          app.request({
            url: comm.parseToURL('order', 'addcart'),
            data: { data: JSON.stringify(cartItems) },
            method: 'GET',
            success: function (res) {
              if (res.data.result == 'OK') {
                app.request({
                  url: comm.parseToURL('order', 'createOrder'),
                  data: [],
                  method: 'GET',
                  success: function (ress) {
                    if (ress.data.result == 'OK') {
                      var oid = ress.data.oid
                      wx.navigateTo({
                        url: '../order_confirm/order_confirm?fr=cart&oid=' + oid
                      })
                    } else {
                      wx.hideLoading()
                      wx.showToast({
                        title: ress.data.errmsg
                      })
                    }
                  }
                })

              } else if (res.data.errmsg=='2'){
                wx.navigateTo({
                  url: '../login/login',
                })
                
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '请求失败'
                })
              }
            }
          })
        }
      }
    })
    
    
    
      
    
    
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let foods = this.data.foods;
    const selected = foods[index].selected;
    foods[index].selected = !selected;
    this.setData({
      foods: foods
    });
    this.isSelectAll();
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let foods = this.data.foods;
    foods.splice(index,1);
    this.setData({
      foods: foods
    });
    app.globalData.carts = foods
    if(!foods.length){
      this.setData({
        hasList: false,
        'prompt.hidden': false
      });
    }else{
      this.isSelectAll();
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let foods = this.data.foods;

    for (let i = 0; i < foods.length; i++) {
      foods[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      foods: foods
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let foods = this.data.foods;
    let num = foods[index].num;
    num = num + 1;
    foods[index].num = num;
    this.setData({
      foods: foods
    });
    app.globalData.carts = foods
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    let foods = this.data.foods;
    let num = foods[index].num;
    if(num <= 1){
      return false;
    }
    num = num - 1;
    foods[index].num = num;
    this.setData({
      foods: foods
    });
    app.globalData.carts = foods
    this.getTotalPrice();
  },
/**
   * 判断全选状态
   */
  isSelectAll(){
    let selectAllStatus = this.data.selectAllStatus;
    let foods = this.data.foods;

    for (let i = 0; i < foods.length; i++) {
      if (!foods[i].selected){
        selectAllStatus = false;
        break
      }
      selectAllStatus = true;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
    });
  },


  /**
   * 计算总价
   */
  getTotalPrice() {
    let foods = this.data.foods;                  // 获取购物车列表
    let totalPri = 0;
    let totleNum = 0;
    let jsStatus = this.data.jsStatus;
    for(let i = 0; i<foods.length; i++) {         // 循环列表得到每个数据
      if(foods[i].selected) {                     // 判断选中才会计算价格
        totalPri += foods[i].num * foods[i].price;   // 所有价格加起来
        totleNum += foods[i].num;
      }
    }
    if (totalPri > 0){
      jsStatus = true;
    }else{
      jsStatus = false;
    }
    this.setData({
      totleNum: totleNum,
      jsStatus: jsStatus,                                // 最后赋值到data中渲染到页面
      foods: foods,
      totalPrice: totalPri.toFixed(2)
    });
  },
  onPullDownRefresh: function () {
    this.onShow()
    wx.stopPullDownRefresh()
  }

})