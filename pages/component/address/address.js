// page/component/new-pages/user/address/address.js
import { Promise } from '../../../utils/util-2';
var comm = require('../../../common/common.js');

/**
 *  查询接口
 */
const API = 'https://lishifeng2.mywopop.com/api/user/basearea?pid=';
var app = getApp()
Page({
  data:{
    address:{
      name:'',
      phone:'',
      detail:'',
      is_def:'',
      province:''
    },
    isShow:false,
    areaname: [],
    uid: 0
  },

  // onLoad(){
  //   var self = this;
    
  //   wx.getStorage({
  //     key: 'address',
  //     success: function(res){
  //       self.setData({
  //         address : res.data
  //       })
  //     }
  //   })
  // },
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
    var is_default = '0'
    if(e.detail.value==true) is_default = '1' 
    this.setData({
      'address.is_def' : e.detail.value,
      'address.is_default': is_default
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
    console.log(this.data.address)
  },







  addDot: function (arr) {
    if (arr instanceof Array) {
      arr.map(val => {
        if (val.fullName.length > 4) {
          val.fullNameDot = val.fullName.slice(0, 4) + '...';
          return val;
        } else {
          val.fullNameDot = val.fullName;
          return val;
        }
      })
    }
  },
  /**
   * 初始化区域数据
   */
  onLoad: function (opt) {
    var that = this
    var pid = 1
    var uid = 0
    if(opt.id){
      uid = opt.id
    }
    that.setData({
      isShow: false, // 显示区域选择框
      showDistrict: true // 默认为省市区三级区域选择
    });
    // if (opt && !opt.showDistrict) {
    //   this.setData({
    //     showDistrict: false
    //   });
    // }
    
    if (uid){
      
      app.request({
        url: comm.parseToURL('user','getconsignee'),
        data: {id: uid},
        success: function(res){
          if(res.data.result == 'OK'){
            var address = res.data.data
            var areaname = res.data.areaname
            var prov = areaname[address['prov_id']]
            var city = areaname[address['city_id']]
            var dist = areaname[address['dist_id']]
            address.province = prov + ' - ' + city + ' - ' + dist
            if (address.is_default == '1') address.is_def = true
            else address.is_def = false
            that.setData({
              address: address,
              areaname: areaname,
              uid: uid
            })
          } else {
            wx.showToast({
              title: '参数错误'
            })
            wx.navigateBack()
          }
        }
      })
    }
    Promise(app.request, {
      url: API + pid,
      data: {},
      method: 'GET'
    }).then((province) => {
      const firstProvince = province.data.data[0];
      that.addDot(province.data.data);
      /**
       * 默认选择获取的省份第一个省份数据
       */
      that.setData({
        proviceData: province.data.data,
        'selectedProvince.index': 0,
        'selectedProvince.code': firstProvince.code,
        'selectedProvince.fullName': firstProvince.fullName,
      });
      
      return (
        Promise(app.request, {
          url: API + firstProvince.code,
          data: {},
          method: 'GET'
        })
      );
    }).then((city) => {
      const firstCity = city.data.data[0];
      that.addDot(city.data.data);
      that.setData({
        cityData: city.data.data,
        'selectedCity.index': 0,
        'selectedCity.code': firstCity.code,
        'selectedCity.fullName': firstCity.fullName,
      });
      /**
       * 省市二级则不请求区域
       */
      if (that.data.showDistrict) {
        return (
          Promise(app.request, {
            url: API + firstCity.code,
            data: {},
            method: 'GET'
          })
        );
      } else {
        that.setData({
          value: [0, 0]
        });
        return;
      }
    }).then((district) => {
      const firstDistrict = district.data.data[0];
      that.addDot(district.data.data);
      that.setData({
        value: [0, 0, 0],
        districtData: district.data.data,
        'selectedDistrict.index': 0,
        'selectedDistrict.code': firstDistrict.code,
        'selectedDistrict.fullName': firstDistrict.fullName,
        //'address.province': that.data.proviceData[0].fullName + ' - ' + that.data.cityData[0].fullName + ' - ' + district.data.data[0].fullName
      });
    }).catch((e) => {
      console.log(e);
    })
  },
  /**
   * 页面选址触发事件
   */
  choosearea: function () {
    this.setData({
      isShow: true
    })
  },
  /**
   * 滑动事件
   */
  bindChange: function (e) {
    const current_value = e.detail.value, _data = this.data;
    let address = _data.address;
    if (current_value.length > 2) {
      if (this.data.value[0] !== current_value[0] && this.data.value[1] === current_value[1] && this.data.value[2] === current_value[2]) {
        // 滑动省份
        Promise(app.request, {
          url: API + _data.proviceData[current_value[0]].code,
          data: {},
          method: 'GET'
        }).then((city) => {
          this.addDot(city.data.data);
          this.setData({
            cityData: city.data.data
          })
          return (
            Promise(app.request, {
              url: API + city.data.data[0].code,
              data: {},
              method: 'GET'
            })
          );
          }).then((district) => {
          if (district.data.data.length > 0) {
            this.addDot(district.data.data);
            this.setData({
              districtData: district.data.data,
              'value[0]': current_value[0],
              'value[1]': 0,
              'value[2]': 0
            })
            
            address.province = this.data.proviceData[current_value[0]].fullName + ' - ' + this.data.cityData[0].fullName + ' - ' + district.data.data[0].fullName
            address.prov_id = this.data.proviceData[current_value[0]].code
            address.city_id = this.data.cityData[current_value[1]].code
            address.dist_id = this.data.districtData[current_value[2]].code

            this.setData({
              address: address
            })
          }


        }).catch((e) => {
          console.log(e);
        })
      } else if (this.data.value[0] === current_value[0] && this.data.value[1] !== current_value[1] && this.data.value[2] === current_value[2]) {
        // 滑动城市
        Promise(app.request, {
          url: API + _data.cityData[current_value[1]].code,
          data: {},
          method: 'GET'
        }).then((district) => {
          if (district.data.data.length > 0) {
            this.addDot(district.data.data);

            address.province = this.data.proviceData[current_value[0]].fullName + ' - ' + this.data.cityData[current_value[1]].fullName + ' - ' + district.data.data[0].fullName
            address.prov_id = this.data.proviceData[current_value[0]].code
            address.city_id = this.data.cityData[current_value[1]].code
            address.dist_id = this.data.districtData[current_value[2]].code

            this.setData({
              districtData: district.data.data,
              'value[0]': current_value[0],
              'value[1]': current_value[1],
              'value[2]': 0,
              address: address
            })
          }
        }).catch((e) => {
          console.log(e);
        })

      } else if (this.data.value[0] === current_value[0] && this.data.value[1] === current_value[1] && this.data.value[2] !== current_value[2]) {
        // 滑动地区
        address.province = this.data.proviceData[current_value[0]].fullName + ' - ' + this.data.cityData[current_value[1]].fullName + ' - ' + this.data.districtData[current_value[2]].fullName
        address.prov_id = this.data.proviceData[current_value[0]].code
        address.city_id = this.data.cityData[current_value[1]].code
        address.dist_id = this.data.districtData[current_value[2]].code

        this.setData({
          value: current_value,
          address: address
        })
      }
      
      
    }
  }







})