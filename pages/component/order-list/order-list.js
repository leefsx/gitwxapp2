

Page({
    data: {
        activeIndex: 0,
        order: {},
        prompt: {
            hidden: !0,
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
        orders: [
          // status 0 代付款
          //        1 已付款
          //        2 订单取消
          {
            "id": 1,
            "number": "A4501354410893725",
            "url": "/image/o1.jpg",
            "name": "坚果零食大礼包",
            "count": "3个",
            "status": 0,
            "money": "450"
          },
          {
            "id": 2,
            "number": "A8214204077416524",
            "url": "/image/o2.jpg",
            "name": "坚果零食大礼包",
            "count": "半斤",
            "status": 1,
            "money": "100"
          },
          {
            "id": 3,
            "number": "A8214204077416524",
            "url": "/image/o3.jpg",
            "name": "坚果零食大礼包",
            "count": "半斤",
            "status": 2,
            "money": "100"
          }
        ]
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
    }
})