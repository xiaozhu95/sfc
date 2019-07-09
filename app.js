var e, t = require("./utils/utils.js"),
  n = require("./commons/order-pay/order-pay.js");

App({
  is_on_launch: !0,
  onLaunch: function() {
    wx.removeStorage({
      key: 'board',
      success(res) {
        // console.log(res.data)
      }
    })
    this.setApi(), e = this.api, this.getNavigationBarColor(), console.log(wx.getSystemInfoSync()),
      this.getStoreData(), this.getCatList();
  },
  getStoreData: function() {
    this.request({
      url: e.default.store,
      success: function(e) {
        0 == e.code && (wx.setStorageSync("store", e.data.store), wx.setStorageSync("store_name", e.data.store_name),
          wx.setStorageSync("show_customer_service", e.data.show_customer_service), wx.setStorageSync("contact_tel", e.data.contact_tel),
          wx.setStorageSync("share_setting", e.data.share_setting));
      },
      complete: function() {}
    });
  },
  getCatList: function() {
    this.request({
      url: e.default.cat_list,
      success: function(e) {
        if (0 == e.code) {
          var t = e.data.list || [];
          wx.setStorageSync("cat_list", t);
        }
      }
    });
  },
  login: require("utils/login.js"),
  request: require("utils/request.js"),
  saveFormId: function(t) {
    this.request({
      url: e.user.save_form_id,
      data: {
        form_id: t
      }
    });
  },
  loginBindParent: function(e) {
    if ("" == wx.getStorageSync("access_token")) return !0;
    getApp().bindParent(e);
  },
  bindParent: function(t) {
    if ("undefined" != t.parent_id && 0 != t.parent_id) {
      console.log("Try To Bind Parent With User Id:" + t.parent_id);
      var n = wx.getStorageSync("user_info");
      wx.getStorageSync("share_setting").level > 0 && 0 != t.parent_id && getApp().request({
        url: e.share.bind_parent,
        data: {
          parent_id: t.parent_id
        },
        success: function(e) {
          0 == e.code && (n.parent = e.data, wx.setStorageSync("user_info", n));
        }
      });
    }
  },
  shareSendCoupon: function(t) {
    wx.showLoading({
      mask: !0
    }), t.hideGetCoupon || (t.hideGetCoupon = function(e) {
      var n = e.currentTarget.dataset.url || !1;
      t.setData({
        get_coupon_list: null
      }), n && wx.navigateTo({
        url: n
      });
    }), this.request({
      url: e.coupon.share_send,
      success: function(e) {
        0 == e.code && t.setData({
          get_coupon_list: e.data.list
        });
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },
  getauth: function(e) {
    wx.showModal({
      title: "是否打开设置页面重新授权",
      content: e.content,
      confirmText: "去设置",
      success: function(t) {
        t.confirm ? wx.openSetting({
          success: function(t) {
            e.success && e.success(t);
          },
          fail: function(t) {
            e.fail && e.fail(t);
          },
          complete: function(t) {
            e.complete && e.complete(t);
          }
        }) : e.cancel && getApp().getauth(e);
      }
    });
  },
  api: require("api.js"),
  setApi: function() {
    function e(n) {
      for (var a in n) "string" == typeof n[a] ? n[a] = n[a].replace("{$_api_root}", t) : n[a] = e(n[a]);
      return n;
    }
    var t = this.siteInfo.siteroot;
    t = t.replace("app/index.php", ""), t += "addons/yigou_mall/core/web/debug.php?store_id=-1&r=api/",
      this.api = e(this.api);
    var n = this.api.default.index,
      a = n.substr(0, n.indexOf("/index.php"));
    this.webRoot = a;
  },
  webRoot: null,
  siteInfo: require("siteinfo.js"),
  currentPage: null,
  pageOnLoad: function(e) {
    this.page.onLoad(e);
  },
  pageOnReady: function(e) {
    this.page.onReady(e);
  },
  pageOnShow: function(e) {
    this.page.onShow(e);
  },
  pageOnHide: function(e) {
    this.page.onHide(e);
  },
  pageOnUnload: function(e) {
    this.page.onUnload(e);
  },
  page: require("utils/page.js"),
  getNavigationBarColor: function() {
    var t = this;
    t.request({
      url: e.default.navigation_bar_color,
      success: function(e) {
        0 == e.code && (wx.setStorageSync("_navigation_bar_color", e.data), t.setNavigationBarColor());
      }
    });
  },
  setNavigationBarColor: function() {
    var e = wx.getStorageSync("_navigation_bar_color");
    e && wx.setNavigationBarColor(e);
  },
  loginNoRefreshPage: ["pages/index/index", "mch/shop/shop"],
  openWxapp: function(e) {
    if (console.log("--openWxapp---"), e.currentTarget.dataset.url) {
      var t = e.currentTarget.dataset.url;
      (t = function(e) {
        var t = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
          n = /^[^\?]+\?([\w\W]+)$/.exec(e),
          a = {};
        if (n && n[1])
          for (var o, i = n[1]; null != (o = t.exec(i));) a[o[1]] = o[2];
        return a;
      }(t)).path = t.path ? decodeURIComponent(t.path) : "", console.log("Open New App"),
        console.log(t), wx.navigateToMiniProgram({
          appId: t.appId,
          path: t.path,
          complete: function(e) {
            console.log(e);
          }
        });
    }
  },
  uploader: require("utils/uploader"),
  navigatorClick: function(e, t) {
    var n = e.currentTarget.dataset.open_type;
    if ("redirect" == n) return !0;
    if ("wxapp" == n) {
      var a = e.currentTarget.dataset.path;
      "/" != a.substr(0, 1) && (a = "/" + a), wx.navigateToMiniProgram({
        appId: e.currentTarget.dataset.appid,
        path: a,
        complete: function(e) {
          console.log(e);
        }
      });
    }
    if ("tel" == n) {
      var o = e.currentTarget.dataset.tel;
      wx.makePhoneCall({
        phoneNumber: o
      });
    }
    return !1;
  },
  utils: t,
  order_pay: n
});