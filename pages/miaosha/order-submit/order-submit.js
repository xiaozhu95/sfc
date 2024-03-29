var t = require("../../../api.js"), a = getApp(), e = "", i = "", s = require("../../../utils/utils.js");

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
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
        var e = this, i = s.formatData(new Date());
        wx.removeStorageSync("input_data"), e.setData({
            options: t,
            store: wx.getStorageSync("store"),
            time: i
        });
    },
    bindkeyinput: function(t) {
        this.setData({
            content: t.detail.value
        });
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
        var a = this, e = this.data.express_price, i = this.data.express_price_1;
        if (1 == t.target.dataset.index) this.setData({
            offline: 1,
            express_price: 0,
            express_price_1: e,
            is_area: 0
        }); else {
            var s = a.data.is_area_city_id, n = t.target.dataset.city_id;
            s && function(t, a) {
                for (var e = 0; e < t.length; e++) if (a == t[e]) return !1;
                return !0;
            }(s, n) && this.setData({
                is_area: 1
            }), this.setData({
                offline: 0,
                express_price: i
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
        var a = this, e = a.data.offline, i = {};
        if (0 == e) {
            var s = a.data.is_area_city_id;
            if (s && function(t, a) {
                for (var e = 0; e < t.length; e++) if (a == t[e]) return !1;
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
        if (i.offline = e, -1 == a.data.payment) return a.setData({
            show_payment: !0
        }), !1;
        a.data.cart_id_list && (i.cart_id_list = JSON.stringify(a.data.cart_id_list)), a.data.goods_info && (i.goods_info = JSON.stringify(a.data.goods_info)), 
        a.data.picker_coupon && (i.user_coupon_id = a.data.picker_coupon.user_coupon_id), 
        a.data.content && (i.content = a.data.content), 1 == a.data.integral_radio ? i.use_integral = 1 : i.use_integral = 2, 
        i.payment = a.data.payment, i.formId = t.detail.formId, a.order_submit(i, "ms");
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
        var t = this, e = wx.getStorageSync("picker_address");
        if (e) {
            var i = t.data.is_area_city_id;
            i && (!function(t, a) {
                for (var e = 0; e < t.length; e++) if (a == t[e]) return !1;
                return !0;
            }(i, e.city_id) ? t.setData({
                is_area: 0
            }) : t.setData({
                is_area: 1
            })), t.setData({
                address: e,
                name: e.name,
                mobile: e.mobile
            }), wx.removeStorageSync("picker_address"), t.getInputData();
        }
        t.getOrderData(t.data.options);
    },
    getOrderData: function(s) {
        var n = this, o = "";
        n.data.address && n.data.address.id && (o = n.data.address.id), s.goods_info && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.miaosha.submit_preview,
            data: {
                goods_info: s.goods_info,
                address_id: o,
                longitude: e,
                latitude: i
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = t.data.shop_list, e = {};
                    1 == a.length && (e = a[0]);
                    var i = wx.getStorageSync("input_data");
                    i || (i = {
                        address: t.data.address,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : "",
                        shop: e
                    }, t.data.pay_type_list.length > 0 && (i.payment = t.data.pay_type_list[0].payment, 
                    t.data.pay_type_list.length > 1 && (i.payment = -1))), i.total_price = t.data.total_price, 
                    i.goods_list = t.data.list, i.goods_info = t.data.goods_info, i.express_price = parseFloat(t.data.express_price), 
                    i.coupon_list = t.data.coupon_list, i.shop_list = t.data.shop_list, i.send_type = t.data.send_type, 
                    i.level = t.data.level, i.integral = t.data.integral, i.new_total_price = t.data.total_price, 
                    i.is_payment = t.data.is_payment, i.is_coupon = t.data.list[0].coupon, i.is_discount = t.data.list[0].is_discount, 
                    i.is_area = t.data.is_area, i.pay_type_list = t.data.pay_type_list, 1 == t.data.is_area && (i.is_area_city_id = t.data.is_area_city_id), 
                    n.setData(i), n.getInputData(), 1 == t.data.send_type && n.setData({
                        offline: 0
                    }), 2 == t.data.send_type && n.setData({
                        offline: 1
                    }), n.getPrice();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && (1 == getCurrentPages().length ? wx.redirectTo({
                            url: "/pages/index/index"
                        }) : wx.navigateBack({
                            delta: 1
                        }));
                    }
                });
            }
        }));
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
    showCouponPicker: function() {
        var t = this;
        t.getInputData(), t.data.coupon_list && t.data.coupon_list.length > 0 && t.setData({
            show_coupon_picker: !0
        });
    },
    pickCoupon: function(t) {
        var a = this, e = wx.getStorageSync("input_data");
        wx.removeStorageSync("input_data");
        var i = t.currentTarget.dataset.index;
        e.show_coupon_picker = !1, e.picker_coupon = "-1" != i && -1 != i && a.data.coupon_list[i], 
        a.setData(e), a.getPrice();
    },
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
        var a = this, e = t.currentTarget.dataset.index, i = wx.getStorageSync("input_data");
        wx.removeStorageSync("input_data"), i.show_shop = !1, i.shop = "-1" != e && -1 != e && a.data.shop_list[e], 
        a.setData(i), a.getPrice();
    },
    integralSwitchChange: function(t) {
        var a = this;
        0 != t.detail.value ? a.setData({
            integral_radio: 1
        }) : a.setData({
            integral_radio: 2
        }), a.getPrice();
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
        var t = this, a = t.data.total_price, e = t.data.express_price, i = t.data.picker_coupon, s = t.data.integral, n = t.data.integral_radio, o = t.data.level, r = t.data.offline;
        i && (a -= i.sub_price), s && 1 == n && (a -= parseFloat(s.forehead)), o && (a = a * o.discount / 10), 
        a <= .01 && (a = .01), 0 == r && (a += e), t.setData({
            new_total_price: parseFloat(a.toFixed(2))
        });
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
        var a = this, e = t.currentTarget.dataset.index, i = a.data.form, s = i.list;
        s[e].default = t.detail.value, i.list = s, a.setData({
            form: i
        });
    },
    selectForm: function(t) {
        var a = this, e = t.currentTarget.dataset.index, i = t.currentTarget.dataset.k, s = a.data.form, n = s.list;
        if ("radio" == n[e].type) {
            var o = n[e].default_list;
            for (var r in o) r == i ? o[i].is_selected = 1 : o[r].is_selected = 0;
            n[e].default_list = o;
        }
        "checkbox" == n[e].type && (1 == (o = n[e].default_list)[i].is_selected ? o[i].is_selected = 0 : o[i].is_selected = 1, 
        n[e].default_list = o), s.list = n, a.setData({
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
        var t = this, a = {
            address: t.data.address,
            name: t.data.name,
            mobile: t.data.mobile,
            content: t.data.content,
            payment: t.data.payment,
            shop: t.data.shop
        };
        wx.setStorageSync("input_data", a);
    },
    onHide: function() {
        a.pageOnHide(this), this.getInputData();
    },
    onUnLoad: function() {
        a.pageOnUnLoad(this), wx.removeStorageSync("input_data");
    }
});