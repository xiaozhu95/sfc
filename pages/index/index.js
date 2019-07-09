var t = require("../../api.js"),
  a = getApp(),
  e = 0,
  o = 0,
  i = !0,
  s = 1,
  n = "",
  r = !1;

Page({
  data: {
    x: wx.getSystemInfoSync().windowWidth,
    y: wx.getSystemInfoSync().windowHeight,
    left: 0,
    show_notice: !1,
    animationData: {},
    play: -1,
    time: 0,
    buy_user: "",
    buy_address: "",
    buy_time: 0,
    buy_type: "",
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 188,
    time: 6,
    list: [],
    show_coupon: false,
    // isinterval:''
  },
  onLoad: function(t) {
    console.log(a, "a是什么值")
    if (wx.getStorageSync('user_info') == '') {
      return (wx.redirectTo({
        url: '/pages/login/login'
      }));
    }
    /*************弹出广告start****************/
    if (wx.getStorageSync("board") == '') {
      this.getboard();
      console.log("第一次进来")
    } else {
      console.log("不是第一次进来");
      this.setData({
        show_content: true
      })
    }

    /**************弹出广告end****************/
    a.pageOnLoad(this), this.loadData(t);
    var e = 0,
      o = t.user_id,
      i = decodeURIComponent(t.scene);
    void 0 != o ? e = o : void 0 != i && (e = i), a.loginBindParent({
      parent_id: e
    });
  },
  // 广告展示
  getboard() {
    a.pageOnLoad(this), this.setData({
      status: t.status || 0
    }), this.getcouponlist(t);
    wx.request({
      url: 'https://malltest.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=-1&r=api/default/pop&access_token=pBxLSFtuh-9M9e_VwflEqF5qFQe0iY9x&_uniacid=9&_acid=9',
      method: "get",
      data: {},
      success: res => {
        console.log(res, "图片");
        this.setData({
          bg_pic: res.data.data
        })
      }
    })
    // 广告倒计时 start
    console.log(this.data.show_content);
    var currentTime = this.data.time
    var that = this;
    this.isinterval = setInterval(function() {
      currentTime--;
      that.setData({
        codecontent: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(that.isinterval)
        if (that.data.list.length == 0) {
          that.setData({
            codecontent: "31秒",
            time: 61,
            show_content: true
          })
        } else {
          that.setData({
            codecontent: "31秒",
            time: 61,
            show_content: true,
            show_coupon: true
          })
        }

      }
    }, 1000);
    // 广告倒计时 end
    wx.setStorage({
      key: "board",
      data: "true"
    })
  },
  // 关闭页面
  iscolse() {
    console.log(this)
    clearInterval(this.isinterval);
    if (this.data.list.length == 0) {
      this.setData({
        show_content: true
      })
    } else {
      this.setData({
        show_content: true,
        show_coupon: true
      })
    }

  },
  close_coupon() {
    clearInterval(this.isinterval);
    this.setData({
      show_coupon: false
    })
  },
  // 使用优惠券
  goodsdetail(t) {
    var a = t.currentTarget.dataset.goods_id;
    var mc_id = t.currentTarget.dataset.mc_id;
    var goods_id = t.currentTarget.dataset.goods_id;
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + JSON.parse(goods_id)[0],
    })
  },
  getcouponlist(s) {
    var o = this;
    // wx.showLoading({
    //   title: "加载中"
    // }),
    a.request({
      url: t.coupon.index,
      data: {
        status: o.data.status
      },
      success: function(t) {
        0 == t.code && o.setData({
          list: t.data.list
        }), console.log(t.data.list, "优惠券");
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },
  suspension: function() {
    var e = this;
    o = setInterval(function() {
      a.request({
        url: t.default.buy_data,
        data: {
          time: e.data.time
        },
        method: "POST",
        success: function(t) {
          if (0 == t.code) {
            var a = !1;
            n == t.md5 && (a = !0);
            var o = "",
              i = t.cha_time,
              s = Math.floor(i / 60 - 60 * Math.floor(i / 3600));
            o = 0 == s ? i % 60 + "秒" : s + "分" + i % 60 + "秒";
            var r = "购买了",
              d = "/pages/goods/goods?id=" + t.data.goods;
            2 === t.data.type ? (r = "预约了", d = "/pages/book/details/details?id=" + t.data.goods) : 3 === t.data.type ? (r = "秒杀了",
              d = "/pages/miaosha/details/details?id=" + t.data.goods) : 4 === t.data.type && (r = "拼团了",
              d = "/pages/pt/details/details?gid=" + t.data.goods), !a && t.cha_time <= 300 ? (e.setData({
              buy_time: o,
              buy_type: r,
              buy_url: d,
              buy_user: t.data.user.length >= 5 ? t.data.user.slice(0, 4) + "..." : t.data.user,
              buy_avatar_url: t.data.avatar_url,
              buy_address: t.data.address.length >= 8 ? t.data.address.slice(0, 7) + "..." : t.data.address
            }), n = t.md5) : e.setData({
              buy_user: "",
              buy_type: "",
              buy_url: d,
              buy_address: "",
              buy_avatar_url: "",
              buy_time: ""
            });
          }
        }
      });
    }, 1e4);
  },
  loadData: function(e) {
    var o = this,
      s = wx.getStorageSync("pages_index_index");
    s && (s.act_modal_list = [], o.setData(s)), a.request({
      url: t.default.index,
      success: function(t) {
        if (0 == t.code) {
          i ? i = !1 : t.data.act_modal_list = [];
          var a = t.data.topic_list,
            e = new Array();
          if (a && 1 != t.data.update_list.topic.count) {
            if (1 == a.length) e[0] = new Array(), e[0] = a;
            else
              for (var s = 0, n = 0; s < a.length; s += 2,
                n++) void 0 != a[s + 1] && (e[n] = new Array(), e[n][0] = a[s], e[n][1] = a[s + 1]);
            t.data.topic_list = e;
          }
          o.setData(t.data), wx.setStorageSync("store", t.data.store), wx.setStorageSync("pages_index_index", t.data);
          var r = wx.getStorageSync("user_info");
          r && o.setData({
            _user_info: r
          }), o.miaoshaTimer();
        }
      },
      complete: function() {
        wx.stopPullDownRefresh();
      }
    });
  },
  onShow: function() {
    console.log(a);
    a.pageOnShow(this), e = 0;
    var t = wx.getStorageSync("store");
    t && t.name && wx.setNavigationBarTitle({
      title: t.name
    }), 1 === t.purchase_frame ? this.suspension(this.data.time) : this.setData({
      buy_user: ""
    }), clearInterval(1), this.notice();
  },
  onPullDownRefresh: function() {
    clearInterval(s), this.loadData();
  },
  onShareAppMessage: function(t) {
    var o = this;
    return {
      path: "/pages/index/index?user_id=" + wx.getStorageSync("user_info").id,
      success: function(t) {
        1 == ++e && a.shareSendCoupon(o);
      },
      title: o.data.store.name
    };
  },
  receive: function(e) {
    var o = this,
      i = e.currentTarget.dataset.index;
    wx.showLoading({
      title: "领取中",
      mask: !0
    }), o.hideGetCoupon || (o.hideGetCoupon = function(t) {
      var a = t.currentTarget.dataset.url || !1;
      o.setData({
        get_coupon_list: null
      }), a && wx.navigateTo({
        url: a
      });
    }), a.request({
      url: t.coupon.receive,
      data: {
        id: i
      },
      success: function(t) {
        wx.hideLoading(), 0 == t.code ? o.setData({
          get_coupon_list: t.data.list,
          coupon_list: t.data.coupon_list
        }) : (wx.showToast({
          title: t.msg,
          duration: 2e3
        }), o.setData({
          coupon_list: t.data.coupon_list
        }));
      }
    });
  },
  navigatorClick: function(t) {
    var a = t.currentTarget.dataset.open_type,
      e = t.currentTarget.dataset.url;
    return "wxapp" != a || (e = function(t) {
        var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
          e = /^[^\?]+\?([\w\W]+)$/.exec(t),
          o = {};
        if (e && e[1])
          for (var i, s = e[1]; null != (i = a.exec(s));) o[i[1]] = i[2];
        return o;
      }(e), e.path = e.path ? decodeURIComponent(e.path) : "", console.log("Open New App"),
      wx.navigateToMiniProgram({
        appId: e.appId,
        path: e.path,
        complete: function(t) {
          console.log(t);
        }
      }), !1);
  },
  closeCouponBox: function(t) {
    this.setData({
      get_coupon_list: ""
    });
  },
  notice: function() {
    var t = this.data.notice;
    if (void 0 != t) t.length;
  },
  miaoshaTimer: function() {
    var t = this;
    t.data.miaosha && t.data.miaosha.rest_time && (s = setInterval(function() {
      t.data.miaosha.rest_time > 0 ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1,
        t.data.miaosha.times = t.getTimesBySecond(t.data.miaosha.rest_time), t.setData({
          miaosha: t.data.miaosha
        })) : clearInterval(s);
    }, 1e3));
  },
  onHide: function() {
    a.pageOnHide(this), this.setData({
      play: -1
    }), clearInterval(1), clearInterval(o), console.log("hide");
  },
  onUnload: function() {
    a.pageOnUnload(this), this.setData({
      play: -1
    }), clearInterval(s), clearInterval(1), clearInterval(o), console.log("unload");
  },
  showNotice: function() {
    this.setData({
      show_notice: !0
    });
  },
  closeNotice: function() {
    this.setData({
      show_notice: !1
    });
  },
  getTimesBySecond: function(t) {
    if (t = parseInt(t), isNaN(t)) return {
      h: "00",
      m: "00",
      s: "00"
    };
    var a = parseInt(t / 3600),
      e = parseInt(t % 3600 / 60),
      o = t % 60;
    return a >= 1 && (a -= 1), {
      h: a < 10 ? "0" + a : "" + a,
      m: e < 10 ? "0" + e : "" + e,
      s: o < 10 ? "0" + o : "" + o
    };
  },
  to_dial: function() {
    var t = this.data.store.contact_tel;
    wx.makePhoneCall({
      phoneNumber: t
    });
  },
  closeActModal: function() {
    var t, a = this,
      e = a.data.act_modal_list,
      o = !0;
    for (var i in e) {
      var s = parseInt(i);
      e[s].show && (e[s].show = !1, void 0 !== e[t = s + 1] && o && (o = !1, setTimeout(function() {
        a.data.act_modal_list[t].show = !0, a.setData({
          act_modal_list: a.data.act_modal_list
        });
      }, 500)));
    }
    a.setData({
      act_modal_list: e
    });
  },
  naveClick: function(t) {
    var e = this;
    a.navigatorClick(t, e);
  },
  play: function(t) {
    this.setData({
      play: t.currentTarget.dataset.index
    });
  },
  onPageScroll: function(t) {
    var a = this;
    r || -1 != a.data.play && wx.createSelectorQuery().select(".video").fields({
      rect: !0
    }, function(t) {
      var e = wx.getSystemInfoSync().windowHeight;
      (t.top <= -200 || t.top >= e - 57) && a.setData({
        play: -1
      });
    }).exec();
  },
  fullscreenchange: function(t) {
    r = !!t.detail.fullScreen;
  }
});