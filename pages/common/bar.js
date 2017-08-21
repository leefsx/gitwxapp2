var app = getApp()

function showBar(_this) {


  _this.setData({
    'category_info.isShowBar': true
  })

}

function hideBar(_this) {


  _this.setData({
    'category_info.isShowBar': false
  })

}


function getCategory(_this){
    var that = _this;
    that.setData({
      loading: true
    })
    app.request({
      url: app.domain + '/api/product/catelist',
      data: {

      },
      method: 'GET',
      success: function (res) {
        if (res.data.result == 'OK') {
          that.setData({
            "category_info.category": res.data.data
          })
        } else {
          wx.showToast({
            title: '请求失败'
          })
        }
      }
    })
}


function barSwitchTab(e, _this){
    var that = _this
    var cateid = e.currentTarget.dataset.id;
    var catename = e.currentTarget.dataset.name;
    app.globalData.cateid = cateid
    app.globalData.catename = catename
    wx.switchTab({
      url: '/pages/component/category/category', 
    })
    that.setData({
      'category_info.isShowBar': false
    })
}



module.exports = {
  showBar: showBar,
  hideBar: hideBar,
  getCategory: getCategory,
  barSwitchTab: barSwitchTab
}