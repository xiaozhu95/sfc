var a = require("../../../api.js"), t = getApp(), e = "", i = "";

Page({
    data: {
        address: null,
        offline: 1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(a) {
        t.pageOnLoad(this), wx.removeStorageSync("input_data");
        var e, i = this, s = a.goods_info, o = JSON.parse(s);
        e = 3 == o.deliver_type || 1 == o.deliver_type ? 1 : 2, i.setData({
            options: a,
            type: o.type,
            offline: e,
            parent_id: o.parent_id ? o.parent_id : 0
        });
    },
    onReady: function() {},
    onShow: function() {
        t.pageOnShow(this);
        var a = this, e = wx.getStorageSync("picker_address");
        if (e) {
            var i = a.data.is_area_city_id;
            i && (!function(a, t) {
                for (var e = 0; e < a.length; e++) if (t == a[e]) return !1;
                return !0;
            }(i, e.city_id) ? a.setData({
                is_area: 0
            }) : a.setData({
                is_area: 1
            })), a.setData({
                address: e,
                name: e.name,
                mobile: e.mobile
            }), wx.removeStorageSync("picker_address"), a.getInputData();
        }
        a.getOrderData(a.data.options);
    },
    onHide: function() {
        t.pageOnHide(this), this.getInputData();
    },
    onUnload: function() {
        t.pageOnUnload(this), wx.removeStorageSync("input_data");
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    getOrderData: function(s) {
        var o = this, n = "";
        o.data.address && o.data.address.id && (n = o.data.address.id), s.goods_info && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), t.request({
            url: a.group.submit_preview,
            data: {
                goods_info: s.goods_info,
                group_id: s.group_id,
                address_id: n,
                type: o.data.type,
                longitude: e,
                latitude: i
            },
            success: function(a) {
                if (wx.hideLoading(), 0 == a.code) {
                    if (2 == o.data.offline) var t = parseFloat(a.data.total_price - a.data.colonel > 0 ? a.data.total_price - a.data.colonel : .01), e = 0; else var t = parseFloat(a.data.total_price - a.data.colonel > 0 ? a.data.total_price - a.data.colonel : .01) + a.data.express_price, e = parseFloat(a.data.express_price);
                    var i = wx.getStorageSync("input_data");
                    wx.removeStorageSync("input_data"), i || (i = {
                        address: a.data.address,
                        name: a.data.address ? a.data.address.name : "",
                        mobile: a.data.address ? a.data.address.mobile : ""
                    }, a.data.pay_type_list.length > 0 && (i.payment = a.data.pay_type_list[0].payment, 
                    a.data.pay_type_list.length > 1 && (i.payment = -1))), i.total_price = a.data.total_price, 
                    i.goods_list = a.data.list, i.goods_info = a.data.goods_info, i.express_price = e, 
                    i.send_type = a.data.send_type, i.total_price_1 = t.toFixed(2), i.colonel = a.data.colonel, 
                    i.pay_type_list = a.data.pay_type_list, i.shop_list = a.data.shop_list, i.shop = {}, 
                    i.shop_list && 1 == i.shop_list.length && (i.shop = i.shop_list[0]), i.res = a.data, 
                    i.is_area = a.data.is_area, 1 == a.data.is_area && (i.is_area_city_id = a.data.is_area_city_id), 
                    o.setData(i), o.getInputData();
                }
                1 == a.code && wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(a) {
                        a.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        }));
    },
    bindkeyinput: function(a) {
        this.setData({
            content: a.detail.value
        });
    },
    orderSubmit: function(a) {
        var t = this, e = {}, i = t.data.offline;
        if (1 == i) {
            var s = t.data.is_area_city_id;
            if (s && function(a, t) {
                for (var e = 0; e < a.length; e++) if (t == a[e]) return !1;
                return !0;
            }(s, t.data.address.city_id)) return void wx.showToast({
                title: "所选地区无货",
                image: "/images/icon-warning.png"
            });
        }
        if (e.offline = i, 1 == i) {
            if (!t.data.address || !t.data.address.id) return void wx.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            e.address_id = t.data.address.id;
        } else {
            if (e.address_name = t.data.name, e.address_mobile = t.data.mobile, !t.data.shop.id) return void wx.showToast({
                title: "请选择核销门店",
                image: "/images/icon-warning.png"
            });
            if (e.shop_id = t.data.shop.id, console.log(e.address_name), !e.address_name || void 0 == e.address_name) return void wx.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!e.address_mobile || void 0 == e.address_mobile) return void wx.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^1\d{10}$/.test(e.address_mobile)) return void wx.showModal({
                title: "提示",
                content: "手机号格式不正确"
            });
        }
        return -1 == t.data.payment ? (t.setData({
            show_payment: !0
        }), !1) : (t.data.goods_info && (e.goods_info = JSON.stringify(t.data.goods_info)), 
        t.data.picker_coupon && (e.user_coupon_id = t.data.picker_coupon.user_coupon_id), 
        t.data.content && (e.content = t.data.content), t.data.type && (e.type = t.data.type), 
        t.data.parent_id && (e.parent_id = t.data.parent_id), e.payment = t.data.payment, 
        e.formId = a.detail.formId, void t.order_submit(e, "pt"));
    },
    KeyName: function(a) {
        this.setData({
            name: a.detail.value
        });
    },
    KeyMobile: function(a) {
        this.setData({
            mobile: a.detail.value
        });
    },
    getOffline: function(a) {
        var t = this, e = a.target.dataset.index, i = parseFloat(t.data.res.total_price - t.data.res.colonel > 0 ? t.data.res.total_price - t.data.res.colonel : .01) + t.data.res.express_price;
        if (1 == e) {
            var s = t.data.is_area_city_id, o = a.target.dataset.city_id;
            s && function(a, t) {
                for (var e = 0; e < a.length; e++) if (t == a[e]) return !1;
                return !0;
            }(s, o) && this.setData({
                is_area: 1
            }), this.setData({
                offline: 1,
                express_price: t.data.res.express_price,
                total_price_1: i.toFixed(2)
            });
        } else {
            var n = (t.data.total_price_1 - t.data.express_price).toFixed(2);
            this.setData({
                offline: 2,
                express_price: 0,
                total_price_1: n,
                is_area: 0
            });
        }
    },
    showShop: function(a) {
        var t = this;
        t.getInputData(), t.dingwei(), t.data.shop_list && t.data.shop_list.length >= 1 && t.setData({
            show_shop: !0
        });
    },
    dingwei: function() {
        var a = this;
        wx.chooseLocation({
            success: function(t) {
                e = t.longitude, i = t.latitude, a.setData({
                    location: t.address
                });
            },
            fail: function(e) {
                t.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(t) {
                        t && (t.authSetting["scope.userLocation"] ? a.dingwei() : wx.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    pickShop: function(a) {
        var t = this, e = wx.getStorageSync("input_data"), i = a.currentTarget.dataset.index;
        e.show_shop = !1, e.shop = "-1" != i && -1 != i && t.data.shop_list[i], t.setData(e);
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            payment: t,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function() {
        var a = this, t = {
            address: a.data.address,
            name: a.data.name,
            mobile: a.data.mobile,
            payment: a.data.payment,
            content: a.data.content
        };
        wx.setStorageSync("input_data", t);
    }
});