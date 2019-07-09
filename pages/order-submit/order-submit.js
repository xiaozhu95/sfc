var t = require("../../api.js"),
  a = getApp(),
  e = "",
  i = "",
  s = require("../../utils/utils.js");

Page({
  data: {
    total_price: 0,
    address: null,
    express_price: 0,
    content: "",
    offline: 0,
    express_price_1: 0,
    name: "",
    mobile: "",
    integral_radio: 2,
    new_total_price: 0,
    show_card: !1,
    payment: -1,
    show_payment: !1,
    elintegral: true,
    /*积分选用*/
    exchange_integral: 0,
    new_integral: 0,
    integral_freight: 0
  },
  onLoad: function(t) {
    a.pageOnLoad(this);
    var e = this,
      i = s.formatData(new Date());
    wx.removeStorageSync("input_data"), e.setData({
      options: t,
      store: wx.getStorageSync("store"),
      time: i
    });
  },
  bindkeyinput: function(t) {
    var a = t.currentTarget.dataset.mchIndex; - 1 == a ? this.setData({
      content: t.detail.value
    }) : (this.data.mch_list[a] && (this.data.mch_list[a].content = t.detail.value),
      this.setData({
        mch_list: this.data.mch_list
      }));
  },
  KeyName: function(t) {
    this.setData({
      name: t.detail.value
    });
  },
  KeyMobile: function(t) {
    this.setData({
      mobile: t.detail.value
    });
  },
  getOffline: function(t) {
    var a = this,
      e = this.data.express_price,
      i = this.data.express_price_1,
      s = t.currentTarget.dataset.index,
      o = a.data.offer_rule;
    if (1 == s) o.is_allowed = 0, this.setData({
      offline: 1,
      express_price: 0,
      express_price_1: e,
      is_area: 0,
      offer_rule: o
    });
    else {
      var n = a.data.is_area_city_id,
        d = a.data.address ? a.data.address.city_id : null;
      o.is_allowed = 1, d && n && function(t, a) {
        for (var e = 0; e < t.length; e++)
          if (a == t[e]) return !1;
        return !0;
      }(n, d) && this.setData({
        is_area: 1
      }), this.setData({
        offline: 0,
        express_price: i,
        offer_rule: o
      });
    }
    a.getPrice();
  },
  dingwei: function() {
    var t = this;
    wx.chooseLocation({
      success: function(a) {
        e = a.longitude, i = a.latitude, t.setData({
          location: a.address
        });
      },
      fail: function(e) {
        a.getauth({
          content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
          success: function(a) {
            a && (a.authSetting["scope.userLocation"] ? t.dingwei() : wx.showToast({
              title: "您取消了授权",
              image: "/images/icon-warning.png"
            }));
          }
        });
      }
    });
  },
  orderSubmit: function(t) {
    var a = this,
      e = a.data.offline,
      i = {};
    if (0 == e) {
      var s = a.data.is_area_city_id;
      if (s && function(t, a) {
          for (var e = 0; e < t.length; e++)
            if (a == t[e]) return !1;
          return !0;
        }(s, a.data.address.city_id)) return void wx.showToast({
        title: "所选地区无货",
        image: "/images/icon-warning.png"
      });
    }
    if (0 == e) {
      if (!a.data.address || !a.data.address.id) return void wx.showToast({
        title: "请选择收货地址",
        image: "/images/icon-warning.png"
      });
      i.address_id = a.data.address.id;
    } else {
      if (i.address_name = a.data.name, i.address_mobile = a.data.mobile, !a.data.shop.id) return void wx.showModal({
        title: "警告",
        content: "请选择门店",
        showCancel: !1
      });
      if (i.shop_id = a.data.shop.id, !i.address_name || void 0 == i.address_name) return void a.showToast({
        title: "请填写收货人",
        image: "/images/icon-warning.png"
      });
      if (!i.address_mobile || void 0 == i.address_mobile) return void a.showToast({
        title: "请填写联系方式",
        image: "/images/icon-warning.png"
      });
      if (!/^1\d{10}$/.test(i.address_mobile)) return void wx.showModal({
        title: "提示",
        content: "手机号格式不正确",
        showCancel: !1
      });
    }
    i.offline = e;
    var o = a.data.form;
    if (1 == o.is_form && a.data.goods_list && a.data.goods_list.length) {
      var n = o.list;
      for (var d in n)
        if ("date" == n[d].type && (n[d].default = n[d].default ? n[d].default : a.data.time),
          "time" == n[d].type && (n[d].default = n[d].default ? n[d].default : "00:00"), 1 == n[d].required)
          if ("radio" == n[d].type || "checkboxc" == n[d].type) {
            var r = !1;
            for (var c in n[d].default_list) 1 == n[d].default_list[c].is_selected && (r = !0);
            if (!r) return wx.showModal({
              title: "提示",
              content: "请填写" + o.name + "，加‘*’为必填项",
              showCancel: !1
            }), !1;
          } else if (!n[d].default || void 0 == n[d].default) return wx.showModal({
        title: "提示",
        content: "请填写" + o.name + "，加‘*’为必填项",
        showCancel: !1
      }), !1;
    }
    console.log(a.data.pay_type_list[1].payment, "支付方式")
    console.log(a.data.payment, "是否显示");
    console.log(!0);
    console.log(this.data.elintegral, "大杰拉德看接口")
    if (this.data.elintegral && this.data.integral_freight == 0) {
      if (-1 == a.data.payment) return a.setData({
        show_payment: !0
      }), !1;
    }
    if (i.form = JSON.stringify(o), a.data.cart_id_list && (i.cart_id_list = JSON.stringify(a.data.cart_id_list)),
      a.data.mch_list && a.data.mch_list.length) {
      var l = [];
      for (var d in a.data.mch_list)
        if (a.data.mch_list[d].cart_id_list) {
          var _ = {
            id: a.data.mch_list[d].id,
            cart_id_list: a.data.mch_list[d].cart_id_list,
            mch_user_coupon_id: a.data.mch_list[d].store_coupon_id || 0
          };
          a.data.mch_list[d].content && (_.content = a.data.mch_list[d].content), l.push(_);
        }
      l.length ? i.mch_list = JSON.stringify(l) : i.mch_list = "";
    }
    console.log(a.data.store_coupon, '商家卡券')
    a.data.goods_info && (i.goods_info = JSON.stringify(a.data.goods_info)),
      /*优惠券*/
      a.data.picker_coupon && (i.user_coupon_id = a.data.picker_coupon.user_coupon_id),
      a.data.store_coupon && (i.mch_user_coupon_id = a.data.store_coupon.user_coupon_id),
      a.data.content && (i.content = a.data.content), a.data.cart_list && (i.cart_list = JSON.stringify(a.data.cart_list)),
      1 == a.data.integral_radio ? i.use_integral = 1 : i.use_integral = 2,
      a.data.goods_list && a.data.goods_list.length || !a.data.mch_list || 1 != a.data.mch_list.length || (i.content = a.data.mch_list[0].content ? a.data.mch_list[0].content : ""),
      i.payment = a.data.payment;
    i.formId = t.detail.formId;
    if (this.data.elintegral) {
      i.is_exchange = 0;
      i.payment = a.data.payment;
    } else {
      i.payment = a.data.pay_type_list[0].payment;
      i.is_exchange = 1;
      if (a.data.user_integral < a.data.new_integral) {
        return wx.showToast({
          title: '积分不足',
          icon: 'none',
          duration: 2000
        });
      }
    }
    console.log(i, "i是什么")
    a.order_submit(i, "s");
    console.log(a, "提交")
  },
  onReady: function() {},
  onShow: function() {
    a.pageOnShow(this);
    console.log(this.data)
    var t = this,
      e = wx.getStorageSync("picker_address");
    if (e) {
      var i = t.data.is_area_city_id,
        s = {};
      i && (! function(t, a) {
          for (var e = 0; e < t.length; e++)
            if (a == t[e]) return !1;
          return !0;
        }(i, e.city_id) ? s.is_area = 0 : s.is_area = 1), s.address = e, s.name = e.name,
        s.mobile = e.mobile, wx.removeStorageSync("picker_address"), t.setData(s), t.getInputData();
    }
    t.getOrderData(t.data.options);
  },
  getOrderData: function(s) {
    var o = this,
      n = {},
      d = "";
    if (o.data.address && o.data.address.id && (d = o.data.address.id), n.address_id = d,
      n.longitude = e, n.latitude = i, wx.showLoading({
        title: "正在加载",
        mask: !0
      }), s.cart_list) {
      JSON.parse(s.cart_list);
      n.cart_list = s.cart_list;
    }
    if (s.cart_id_list) {
      var r = JSON.parse(s.cart_id_list);
      n.cart_id_list = r;
    }
    if (s.mch_list) {
      var c = JSON.parse(s.mch_list);
      n.mch_list = c;
    }
    s.goods_info && (n.goods_info = s.goods_info), a.request({
      url: t.order.submit_preview,
      data: n,
      success: function(t) {
        if (wx.hideLoading(), 0 == t.code) {
          /*********拿到用户的积分**********/
          o.setData({
            user_integral: t.data.user_integral
          })
          var a = wx.getStorageSync("input_data");
          wx.removeStorageSync("input_data");
          var e = [],
            i = t.data.coupon_list;
          for (var s in i) null != i[s] && e.push(i[s]);
          var n = t.data.shop_list,
            d = {};
          n && 1 == n.length && (d = n[0]), t.data.is_shop && (d = t.data.is_shop), a || ((a = {
              shop: d,
              address: t.data.address || null,
              name: t.data.address ? t.data.address.name : "",
              mobile: t.data.address ? t.data.address.mobile : "",
              pay_type_list: t.data.pay_type_list,
              form: t.data.form
            }).pay_type_list.length > 1 ? a.payment = -1 : a.payment = a.pay_type_list[0].payment),
            a.total_price = t.data.total_price || 0,
            a.goods_list = t.data.list || null,
            a.express_price = parseFloat(t.data.express_price),
            /******自营优惠券*****/
            a.coupon_list = i,
            a.shop_list = n,
            a.send_type = t.data.send_type,
            a.level = t.data.level,
            /******积分数据*********/
            a.new_total_price = t.data.total_price || 0,
            a.exchange_integral = t.data.exchange_integral || 0,
            a.new_integral = t.data.exchange_integral || 0,
            a.integral = t.data.integral,
            a.goods_card_list = t.data.goods_card_list || [],
            a.is_payment = t.data.is_payment, a.mch_list = t.data.mch_list || null, a.is_area_city_id = t.data.is_area_city_id,
            a.pay_type_list = t.data.pay_type_list, a.offer_rule = t.data.offer_rule, o.setData(a),
            o.getInputData(), t.data.goods_info && o.setData({
              goods_info: t.data.goods_info
            }),
            t.data.cart_id_list && o.setData({
              cart_id_list: t.data.cart_id_list
            }),
            t.data.cart_list && o.setData({
              cart_list: t.data.cart_list
            }),
            1 == t.data.send_type && o.setData({
              offline: 0
            }),
            2 == t.data.send_type && o.setData({
              offline: 1
            }),
            o.getPrice(),
            1 == t.data.is_area && o.setData({
              is_area: 1
            });
        }
        1 == t.code && wx.showModal({
          title: "提示",
          content: t.msg,
          success: function(t) {
            console.log(t);
            if (t.cancel) {
              wx.navigateBack({
                delta: 1
              });
            } else {
              t.confirm && wx.navigateTo({
                url: '/pages/register/register',
              })
            }
          }
        });
      }
    });
  },
  copyText: function(t) {
    var a = t.currentTarget.dataset.text;
    a && wx.setClipboardData({
      data: a,
      success: function() {
        page.showToast({
          title: "已复制内容"
        });
      },
      fail: function() {
        page.showToast({
          title: "复制失败",
          image: "/images/icon-warning.png"
        });
      }
    });
  },
  /****自营****/
  showCouponPicker: function() {
    var t = this;
    console.log(this.data.mch_list);
    t.getInputData(),
      t.data.coupon_list && t.data.coupon_list.length > 0 && t.setData({
        show_coupon_picker: !0
      });
    console.log(t.data.show_coupon_picker)
  },
  pickCoupon: function(t) {
    var a = this,
      e = t.currentTarget.dataset.index,
      i = wx.getStorageSync("input_data");
    wx.removeStorageSync("input_data"),
      console.log(i);
    console.log(i.show_coupon_picker = !1)
    "-1" == e || -1 == e ? (i.picker_coupon = !1, i.show_coupon_picker = !1) : (i.picker_coupon = a.data.coupon_list[e], i.show_coupon_picker = !1),
      a.setData(i), a.getPrice();
  },
  /*****店铺start*****/
  showstore(evnet) {
    var that = this;
    console.log(evnet)
    var index = evnet.currentTarget.dataset.store;
    console.log(index)
    that.getInputData();
    that.data.mch_list[index].mch_coupon_list.length > 0 && that.setData({
      show_store: true,
      store_coupon: that.data.mch_list[index].mch_coupon_list,
      store_index: index
    })
    // console.log(that.data.store_coupon[index].store_price == undefined);
  },
  storeCoupon(event) {
    var that = this;
    var k = event.currentTarget.dataset.index;
    // var k = event.detail.value;
    var i = wx.getStorageSync("input_data");
    var s_index = that.data.store_index;
    console.log(s_index)
    console.log(that.data.store_index, '列表');
    wx.removeStorageSync("input_data");
    if (k != -1) {
      that.data.mch_list[s_index].store_price = that.data.store_coupon[k].sub_price;
      that.data.mch_list[s_index].store_coupon_id = that.data.store_coupon[k].user_coupon_id;
    } else {
      that.data.mch_list[s_index].store_price = undefined;
      that.data.mch_list[s_index].store_coupon_id = 0;
    }
    wx.removeStorageSync("input_data"),
      that.setData({
        mch_list: that.data.mch_list
      })
    console.log(that.data.mch_list, "变了么");
    console.log()
    "-1" == e || -1 == e ? (i.store_coupon = !1, i.show_store = !1) : (i.store_coupon = that.data.store_coupon[k], i.show_store = !1),
      that.setData(i), that.getPrice();
    console.log(i, "店铺数据");
  },
  /******店铺end*****/
  numSub: function(t, a, e) {
    return 100;
  },
  showShop: function(t) {
    var a = this;
    a.getInputData(), a.dingwei(), a.data.shop_list && a.data.shop_list.length >= 1 && a.setData({
      show_shop: !0
    });
  },
  pickShop: function(t) {
    var a = this,
      e = t.currentTarget.dataset.index,
      i = wx.getStorageSync("input_data");
    wx.removeStorageSync("input_data"), "-1" == e || -1 == e ? (i.shop = !1, i.show_shop = !1) : (i.shop = a.data.shop_list[e],
      i.show_shop = !1), a.setData(i), a.getPrice();
  },
  integralSwitchChange: function(t) {
    this.setData({
      elintegral: !this.data.elintegral
    })
    console.log(this.data.new_integral)
    var a = this;
    // console.log(t);
    // console.log(0 != t.detail.value);
    a.getPrice();
    console.log(this.data.new_integral)
  },
  integration: function(t) {
    var a = this.data.integral.integration;
    wx.showModal({
      title: "积分使用规则",
      content: a,
      showCancel: !1,
      confirmText: "我知道了",
      confirmColor: "#ff4544",
      success: function(t) {
        t.confirm && console.log("用户点击确定");
      }
    });
  },
  getPrice: function() {
    var t = this,
      a = t.data.total_price,
      e = t.data.express_price,
      i = t.data.picker_coupon,
      s = t.data.integral,
      o = t.data.integral_radio,
      n = t.data.level,
      k = t.data.exchange_integral,
      d = t.data.offline;
    console.log(i, "1")
    console.log(e, "aaaaa");
    console.log(t.data.elintegral)
    if (t.data.goods_list && t.data.goods_list.length > 0 && (i && (a -= i.sub_price), s && 1 == o && (a -= parseFloat(s.forehead)), n && (a = a * n.discount / 10), a <= .01 && (a = .01), 0 == d && (a += e)), t.data.mch_list && t.data.mch_list.length);
    if (t.data.elintegral) {
      for (var r in t.data.mch_list) a += t.data.mch_list[r].total_price + t.data.mch_list[r].express_price;
      /*****店铺优惠券*****/
      var store_coupon = t.data.mch_list.filter(function(item) {
        return item.store_price != undefined;
      });
      console.log(t.data.mch_list, "2222")
      for (let j in store_coupon) {
        a -= store_coupon[j].store_price
      }
      if (a <= 0) {
        a = 0;
      }
      console.log(a, "a是什么值")
      t.setData({
        new_total_price: parseFloat(a.toFixed(2))
      });
    } else {
      var express_integral = 0;
      for (let p in t.data.mch_list) {
        express_integral += t.data.mch_list[p].express_price
      }
      var integral_freight = e + express_integral;
      console.log(integral_freight, "总运费")
      if (t.data.mch_list[0].exchange_integral != undefined) {
        for (var r in t.data.mch_list) k += t.data.mch_list[r].exchange_integral;
      }
      t.setData({
        new_integral: parseFloat(k.toFixed(2)),
        integral_freight: integral_freight
      });
    }
  },
  cardDel: function() {
    this.setData({
      show_card: !1
    }), wx.redirectTo({
      url: "/pages/order/order?status=1"
    });
  },
  cardTo: function() {
    this.setData({
      show_card: !1
    }), wx.redirectTo({
      url: "/pages/card/card"
    });
  },
  formInput: function(t) {
    var a = this,
      e = t.currentTarget.dataset.index,
      i = a.data.form,
      s = i.list;
    s[e].default = t.detail.value, i.list = s, a.setData({
      form: i
    });
  },
  selectForm: function(t) {
    var a = this,
      e = t.currentTarget.dataset.index,
      i = t.currentTarget.dataset.k,
      s = a.data.form,
      o = s.list;
    if ("radio" == o[e].type) {
      var n = o[e].default_list;
      for (var d in n) d == i ? n[i].is_selected = 1 : n[d].is_selected = 0;
      o[e].default_list = n;
    }
    "checkbox" == o[e].type && (1 == (n = o[e].default_list)[i].is_selected ? n[i].is_selected = 0 : n[i].is_selected = 1,
      o[e].default_list = n), s.list = o, a.setData({
      form: s
    });
  },
  showPayment: function() {
    this.setData({
      show_payment: !0
    });
  },
  payPicker: function(t) {
    var a = t.currentTarget.dataset.index;
    this.setData({
      payment: a,
      show_payment: !1
    });
  },
  payClose: function() {
    this.setData({
      show_payment: !1
    });
  },
  getInputData: function() {
    var t = this,
      a = {
        address: t.data.address,
        content: t.data.content,
        name: t.data.name,
        mobile: t.data.mobile,
        integral_radio: t.data.integral_radio,
        payment: t.data.payment,
        shop: t.data.shop,
        form: t.data.form,
        picker_coupon: t.data.picker_coupon,
        store_coupon: t.data.store_coupon
      };
    console.log(a)
    wx.setStorageSync("input_data", a);
    console.log(wx.getStorageSync("input_data"));
  },
  onHide: function() {
    a.pageOnHide(this), this.getInputData();
  },
  onUnload: function() {
    a.pageOnUnload(this), wx.removeStorageSync("input_data");
  },
  uploadImg: function(t) {
    var e = this,
      i = t.currentTarget.dataset.index,
      s = e.data.form;
    a.uploader.upload({
      start: function() {
        wx.showLoading({
          title: "正在上传",
          mask: !0
        });
      },
      success: function(t) {
        0 == t.code ? (s.list[i].default = t.data.url, e.setData({
          form: s
        })) : e.showToast({
          title: t.msg
        });
      },
      error: function(t) {
        console.log(t), e.showToast({
          title: t
        });
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  }
});