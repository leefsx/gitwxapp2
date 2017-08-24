
    
    function arrowMinus(_this){
        const li_width = _this.data.li_width
        let scrollLeft = _this.data.scrollLeft
        if (scrollLeft > li_width){
            _this.setData({
              scrollLeft: scrollLeft - li_width
            })
        } else {
            _this.setData({
                scrollLeft: 0
            })
        }
        console.log(_this.data.scrollLeft)
    }
    
    function  arrowPlus(_this){
        const li_width = _this.data.li_width
        let ul_length = _this.data.articalUl.length
        let scrollLeft = _this.data.scrollLeft;
        scrollLeft += li_width
        if (scrollLeft >= (li_width * (ul_length-3))){
            _this.setData({
            scrollLeft: (li_width * (ul_length - 3))
          })
        } else {
            _this.setData({
            scrollLeft: scrollLeft
          })
        }
        console.log(_this.data.scrollLeft)
    }
    function  oTs (e,_this) {
      var m = _this;
      m._x = e.touches[0].clientX;
    }
    function  oTe (e,_this) {
      const li_width = _this.data.li_width
      let ul_length = _this.data.articalUl.length
      let scrollLeft = _this.data.scrollLeft;
      var m = _this;
      m._new_x = e.changedTouches[0].clientX;
      if (m._new_x - m._x < (li_width+20) && m._new_x - m._x > 20){
        scrollLeft -= li_width
        if (scrollLeft<0){
            _this.setData({
            scrollLeft: 0
          })
        } else{
            _this.setData({
            scrollLeft: scrollLeft
          })
        }
      } else if (m._new_x - m._x > (li_width+20) ){
        scrollLeft -= (2 * li_width)
        if (scrollLeft < 0) {
            _this.setData({
            scrollLeft: 0
          })
        } else {
            _this.setData({
            scrollLeft: scrollLeft
          })
        }
      } else if (m._new_x - m._x < 20 && m._new_x - m._x > -20){
        _this.setData({
          scrollLeft : scrollLeft
        })
      } else if (m._new_x - m._x < -20 && m._new_x - m._x > -(li_width+20)) {
        scrollLeft += li_width
        if (scrollLeft >= (li_width * (ul_length - 3))) {
            _this.setData({
            scrollLeft: (li_width * (ul_length - 3))
          })
        } else {
            _this.setData({
            scrollLeft: scrollLeft
          })
        }
      } else if (m._new_x - m._x < -(li_width+20)) {
        scrollLeft += 2 * li_width
        if (scrollLeft >= (li_width * (ul_length - 3))) {
            _this.setData({
            scrollLeft: (li_width * (ul_length - 3))
          })
        } else {
            _this.setData({
            scrollLeft: scrollLeft
          })
        }
      }
      console.log(_this.data.scrollLeft)
    }    




    module.exports = {
        arrowMinus: arrowMinus,
        arrowPlus: arrowPlus,
        oTs: oTs,
        oTe: oTe
      }