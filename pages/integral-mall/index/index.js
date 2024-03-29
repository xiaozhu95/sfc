var t = require("../../../api.js"),
  a = getApp();

Page({
  data: {},
  onLoad: function(t) {
    a.pageOnLoad(this), wx.showLoading({
      title: "加载中"
    });
  },
  onReady: function() {},
  onShow: function() {
    getApp().pageOnShow(this);
    console.log(getApp())
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
            classify: n, //分类列表
            integral: t.data.user.integral,
            avatar_url: wx.getStorageSync("user_info").avatar_url,
            merchant: t.data.integralMch, //积分商家
            entityStore: t.data.integralMchGoodes //商品家
          });
          console.log(e.data.goods_list)
        }
      },
      complete: function(t) {
        wx.hideLoading();
      }
    });
  },
  /********进入积分分类******/
  toclassify(event) {
    console.log(event)
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/integral-ify/conversion?id=' + id + "&name=" + name,
    })
  },
  tostore(evnet) {
    console.log(evnet.currentTarget.dataset.id)
    var id = evnet.currentTarget.dataset.id;
    var index = evnet.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/integral-ify-detail/ify-detail?id=' + id + '&name=' + this.data.merchant[index].name,
    })
  },
  toentityStore(evnet) {
    console.log(evnet.currentTarget.dataset.id)
    var id = evnet.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/integral-mall/store-detail/store?id=' + id,
    })
  },
  exchangeCoupon: function(e) {
    var n = this,
      o = n.data.coupon_list,
      i = e.currentTarget.dataset.index,
      s = o[i],
      r = n.data.integral;
    if (parseInt(s.integral) > parseInt(r)) n.setData({
      showModel: !0,
      content: "当前积分不足",
      status: 1
    });
    else {
      if (parseFloat(s.price) > 0) d = "需要" + s.integral + "积分+￥" + parseFloat(s.price);
      else var d = "需要" + s.integral + "积分";
      if (parseInt(s.total_num) <= 0) return void n.setData({
        showModel: !0,
        content: "已领完,来晚一步",
        status: 1
      });
      if (parseInt(s.num) >= parseInt(s.user_num)) return s.type = 1, void n.setData({
        showModel: !0,
        content: "兑换次数已达上限",
        status: 1,
        coupon_list: o
      });
      wx.showModal({
        title: "确认兑换",
        content: d,
        success: function(e) {
          e.confirm && (parseFloat(s.price) > 0 ? (wx.showLoading({
            title: "提交中"
          }), a.request({
            url: t.integral.exchange_coupon,
            data: {
              id: s.id,
              type: 2
            },
            success: function(t) {
              0 == t.code && wx.requestPayment({
                timeStamp: t.data.timeStamp,
                nonceStr: t.data.nonceStr,
                package: t.data.package,
                signType: t.data.signType,
                paySign: t.data.paySign,
                complete: function(a) {
                  "requestPayment:fail" != a.errMsg && "requestPayment:fail cancel" != a.errMsg ? "requestPayment:ok" == a.errMsg && (s.num = parseInt(s.num),
                    s.num += 1, s.total_num = parseInt(s.total_num), s.total_num -= 1, r = parseInt(r),
                    r -= parseInt(s.integral), n.setData({
                      showModel: !0,
                      status: 4,
                      content: t.msg,
                      coupon_list: o,
                      integral: r
                    })) : wx.showModal({
                    title: "提示",
                    content: "订单尚未支付",
                    showCancel: !1,
                    confirmText: "确认"
                  });
                }
              });
            },
            complete: function() {
              wx.hideLoading();
            }
          })) : (wx.showLoading({
            title: "提交中"
          }), a.request({
            url: t.integral.exchange_coupon,
            data: {
              id: s.id,
              type: 1
            },
            success: function(t) {
              0 == t.code && (s.num = parseInt(s.num), s.num += 1, s.total_num = parseInt(s.total_num),
                s.total_num -= 1, r = parseInt(r), r -= parseInt(s.integral), n.setData({
                  showModel: !0,
                  status: 4,
                  content: t.msg,
                  coupon_list: o,
                  integral: r
                }));
            },
            complete: function() {
              wx.hideLoading();
            }
          })));
        }
      });
    }
  },
  hideModal: function() {
    this.setData({
      showModel: !1
    });
  },
  couponInfo: function(t) {
    var a = t.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/integral-mall/coupon-info/index?coupon_id=" + a.id
    });
  },
  goodsAll: function() {
    var t = this,
      a = t.data.goods_list,
      e = [];
    for (var n in a) {
      var o = a[n].goods;
      a[n].cat_checked = !1;
      for (var i in o) e.push(o[i]);
    }
    t.setData({
      index_goods: e,
      cat_checked: !0,
      goods_list: a
    });
  },
  catGoods: function(t) {
    var a = t.currentTarget.dataset,
      e = this,
      n = e.data.goods_list,
      o = n.find(function(t) {
        return t.id == a.catId;
      }),
      i = a.index;
    for (var s in n) n[s].id == n[i].id ? n[s].cat_checked = !0 : n[s].cat_checked = !1;
    e.setData({
      index_goods: o.goods,
      goods_list: n,
      cat_checked: !1
    });
  },
  goodsInfo: function(t) {
    var a = t.currentTarget.dataset.goodsId,
      e = this;
    wx.navigateTo({
      url: "/pages/integral-mall/goods-info/index?goods_id=" + a + "&integral=" + e.data.integral
    });
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  shuoming: function() {
    wx.navigateTo({
      url: "/pages/integral-mall/shuoming/index"
    });
  },
  detail: function() {
    wx.navigateTo({
      url: "/pages/integral-mall/detail/index"
    });
  },
  exchange: function() {
    wx.navigateTo({
      url: "/pages/integral-mall/exchange/index"
    });
  },
  register: function() {
    wx.navigateTo({
      url: "/pages/integral-mall/register/index"
    });
  }
});