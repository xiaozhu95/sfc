var t = require("../../api.js"),
  a = getApp(),
  n = !1,
  i = !1;

Page({
  data: {
    gain: !0,
    p: 1,
    status: 1
  },
  onLoad: function(t) {
    getApp().pageOnLoad(this), n = !1, i = !1;
    var a = this;
    t.status && a.setData({
      status: t.status
    });
  },
  onReady: function() {},
  onShow: function() {
    getApp().pageOnShow(this), this.loadData();
    var e = this;
    a.request({
      url: t.integral.index,
      data: {
        page: 1
      },
      success: function(t) {
        if (0 == t.code) {
          var a = [],
            n = t.data.goods_list,
            o = [];
          if (n)
            for (var i in n) n[i].goods.length > 0 && o.push(n[i]);
          if (o.length > 0)
            for (var s in o) {
              var r = o[s].goods;
              for (var d in r) 1 == r[d].is_index && a.push(r[d]);
            }
          t.data.today && e.setData({
            register_day: 1
          }), e.setData({
            banner_list: t.data.banner_list,
            coupon_list: t.data.coupon_list,
            goods_list: o,
            index_goods: a,
            integral: t.data.user.integral,
            avatar_url:wx.getStorageSync("user_info").avatar_url
          });
        }
      },
      complete: function(t) {
        wx.hideLoading();
      }
    });
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {
    var t = this;
    n || t.loadData();
  },
  income: function() {
    wx.redirectTo({
      url: "/pages/integral-mall/detail/index?status=1"
    });
  },
  expenditure: function() {
    wx.redirectTo({
      url: "/pages/integral-mall/detail/index?status=2"
    });
  },
  loadData: function() {
    var e = this;
    if (!i) {
      i = !0, wx.showLoading({
        title: "加载中"
      });
      var o = e.data.p;
      a.request({
        url: t.integral.integral_detail,
        data: {
          page: o,
          status: e.data.status
        },
        success: function(t) {
          if (0 == t.code) {
            var a = e.data.list;
            a = a ? a.concat(t.data.list) : t.data.list, t.data.list.length <= 0 && (n = !0),
              e.setData({
                list: a,
                is_no_more: n,
                p: o + 1
              });
          }
        },
        complete: function(t) {
          i = !1, wx.hideLoading();
        }
      });
    }
  }
});