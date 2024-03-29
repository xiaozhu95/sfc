var a = require("../../../api.js"), t = getApp(), e = "", s = "";

Page({
    data: {
        address: null,
        offline: 1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(a) {
        t.pageOnLoad(this);
        var e = this, s = a.goods_info, i = JSON.parse(s);
        i && e.setData({
            goods_info: i,
            offline: 1,
            id: i.goods_id,
            attr: i.attr,
            attr_price: i.attr_price,
            attr_integral: i.attr_integral
        });
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this), wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var e = this, s = wx.getStorageSync("picker_address");
        s && (e.setData({
            address: s,
            name: s.name,
            mobile: s.mobile
        }), wx.removeStorageSync("picker_address"));
        i = "";
        if (e.data.address && e.data.address.id) var i = e.data.address.id;
        t.request({
            url: a.integral.submit_preview,
            data: {
                goods_info: e.data.goods_info,
                address_id: i
            },
            success: function(a) {
                if (wx.hideLoading(), 0 == a.code) {
                    var t = a.data.shop_list, s = {};
                    t && 1 == t.length && (s = t[0]), a.data.is_shop && (s = a.data.is_shop);
                    var i = parseFloat(e.data.attr_price) + parseFloat(a.data.express_price);
                    if (a.data.express_price) o = a.data.express_price; else var o = 0;
                    e.setData({
                        goods: a.data.goods,
                        address: a.data.address,
                        express_price: o,
                        shop_list: a.data.shop_list,
                        shop: s,
                        name: a.data.address ? a.data.address.name : "",
                        mobile: a.data.address ? a.data.address.mobile : "",
                        total_price: i.toFixed(2)
                    }), 1 == a.data.send_type && e.setData({
                        offline: 1 //快速配送
                    }), 2 == a.data.send_type && e.setData({
                        offline: 0 //到店自提
                    });
                } else wx.showModal({
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
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    getOffline: function(a) {
        var t = this, e = t.data.express_price, s = t.data.total_price;
        if (1 == a.currentTarget.dataset.index) t.setData({
            offline: 1,
            total_price: s
        }); else {
            var i = parseFloat(s - e).toFixed(2);
            t.setData({
                offline: 2,
                total_price2: i
            });
        }
    },
    showShop: function(a) {
        var t = this;
        t.dingwei(), t.data.shop_list && t.data.shop_list.length >= 1 && t.setData({
            show_shop: !0
        });
    },
    dingwei: function() {
        var a = this;
        wx.chooseLocation({
            success: function(t) {
                e = t.longitude, s = t.latitude, a.setData({
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
        var t = this, e = a.currentTarget.dataset.index;
        "-1" == e || -1 == e ? t.setData({
            shop: !1,
            show_shop: !1
        }) : t.setData({
            shop: t.data.shop_list[e],
            show_shop: !1
        });
    },
    bindkeyinput: function(a) {
        this.setData({
            content: a.detail.value
        });
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
    orderSubmit: function(e) {
        var s = this, i = s.data.offline, o = {};
        console.log(i);
        if (1 == i) {
            if (!s.data.address || !s.data.address.id) return void wx.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            if (o.address_id = s.data.address.id, s.data.total_price) {
                if (s.data.total_price > 0) n = 2; else n = 1;
                o.type = n;
            }
        } else {
            // if (o.address_name = s.data.name, o.address_mobile = s.data.mobile, !s.data.shop.id) return void wx.showModal({
            //     title: "警告",
            //     content: "请选择门店",
            //     showCancel: !1
            // });
            if (o.shop_id = s.data.shop.id, !o.address_name || void 0 == o.address_name) return void s.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!o.address_mobile || void 0 == o.address_mobile) return void s.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^1\d{10}$/.test(o.address_mobile)) return void wx.showModal({
                title: "提示",
                content: "手机号格式不正确",
                showCancel: !1
            });
            if (s.data.total_price2 > 0) n = 2; else var n = 1;
            o.type = n;
        }
        if (o.offline = i, s.data.content && (o.content = s.data.content), s.data.goods_info) {
            var d = s.data.goods_info.attr, r = [];
            for (var c in d) {
                var l = {
                    attr_id: d[c].attr_id,
                    attr_name: d[c].attr_name
                };
                r.push(l);
            }
            s.data.goods_info.attr = r, o.goods_info = JSON.stringify(s.data.goods_info);
        }
        s.data.express_price && (o.express_price = s.data.express_price), o.attr = JSON.stringify(d), 
        wx.showLoading({
            title: "提交中",
            mask: !0
        }), t.request({
            url: a.integral.submit,
            method: "post",
            data: o,
            success: function(a) {
                wx.hideLoading(), 0 == a.code ? 1 == a.type ? wx.redirectTo({
                    url: "/pages/integral-mall/order/order?status=1"
                }) : wx.requestPayment({
                    timeStamp: a.data.timeStamp,
                    nonceStr: a.data.nonceStr,
                    package: a.data.package,
                    signType: a.data.signType,
                    paySign: a.data.paySign,
                    complete: function(a) {
                        "requestPayment:fail" != a.errMsg && "requestPayment:fail cancel" != a.errMsg ? "requestPayment:ok" == a.errMsg && wx.redirectTo({
                            url: "/pages/integral-mall/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(a) {
                                a.confirm && wx.redirectTo({
                                    url: "/pages/integral-mall/order/order?status=0"
                                });
                            }
                        });
                    }
                }) : wx.showToast({
                    title: a.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    }
});