var t = require("../../api.js"),
  a = getApp();

Page({
  data: {
    list: []
  },
  onLoad: function(t) {
    a.pageOnLoad(this), this.setData({
      status: t.status || 0
    }), this.loadData(t);
  },
  loadData: function(s) {
    var o = this;
    wx.showLoading({
      title: "加载中"
    }), a.request({
      url: t.coupon.index,
      data: {
        status: o.data.status
      },
      success: function(t) {
        0 == t.code && o.setData({
          list: t.data.list
        }), console.log(t.data.list);
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },
  goodsList: function(t) {
    var a = t.currentTarget.dataset.goods_id;
    console.log(t)
    var mc_id = t.currentTarget.dataset.mc_id;
    var goods_id = t.currentTarget.dataset.goods_id;
    console.log();
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + JSON.parse(goods_id)[0],
    })
    // if (mc_id != 0) {
    //   wx.navigateTo({
    //     url: '/pages/goods/goods?id=' + a ,
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: "/pages/list/list?goods_id=" + a,
    //     success: function(t) {},
    //     fail: function(t) {}
    //   });
    // }
  },
  onShow: function() {},
  xia: function(t) {
    var a = t.target.dataset.index;
    this.setData({
      check: a
    });
  },
  shou: function() {
    this.setData({
      check: -1
    });
  }
});