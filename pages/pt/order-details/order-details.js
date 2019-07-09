var e = require("../../../api.js"), o = getApp();

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(e) {
        o.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        o.pageOnShow(this), this.loadOrderDetails();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var e = this, o = "/pages/pt/group/details?oid=" + e.data.order_info.order_id;
        return {
            title: e.data.order_info.goods_list[0].name,
            path: o,
            imageUrl: e.data.order_info.goods_list[0].goods_pic,
            success: function(e) {
                console.log(o), console.log(e);
            }
        };
    },
    loadOrderDetails: function() {
        var t = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: e.group.order.detail,
            data: {
                order_id: t.options.id
            },
            success: function(e) {
                0 == e.code ? (3 != e.data.status && t.countDownRun(e.data.limit_time_ms), t.setData({
                    order_info: e.data,
                    limit_time: e.data.limit_time
                })) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.redirectTo({
                            url: "/pages/pt/order/order"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    copyText: function(e) {
        var o = e.currentTarget.dataset.text;
        wx.setClipboardData({
            data: o,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    },
    countDownRun: function(e) {
        var o = this;
        setInterval(function() {
            var t = new Date(e[0], e[1] - 1, e[2], e[3], e[4], e[5]) - new Date(), n = parseInt(t / 1e3 / 60 / 60 % 24, 10), i = parseInt(t / 1e3 / 60 % 60, 10), a = parseInt(t / 1e3 % 60, 10);
            n = o.checkTime(n), i = o.checkTime(i), a = o.checkTime(a), o.setData({
                limit_time: {
                    hours: n > 0 ? n : 0,
                    mins: i > 0 ? i : 0,
                    secs: a > 0 ? a : 0
                }
            });
        }, 1e3);
    },
    checkTime: function(e) {
        return e < 10 && (e = "0" + e), e;
    },
    toConfirm: function(t) {
        var n = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: e.group.order.confirm,
            data: {
                order_id: n.data.order_info.order_id
            },
            success: function(e) {
                e.code, wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.redirectTo({
                            url: "/pages/pt/order-details/order-details?id=" + n.data.order_info.order_id
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    goToGroup: function(e) {
        wx.redirectTo({
            url: "/pages/pt/group/details?oid=" + this.data.order_info.order_id,
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    location: function() {
        var e = this.data.order_info.shop;
        wx.openLocation({
            latitude: parseFloat(e.latitude),
            longitude: parseFloat(e.longitude),
            address: e.address,
            name: e.name
        });
    },
    getOfflineQrcode: function(t) {
        var n = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: e.group.order.get_qrcode,
            data: {
                order_no: t.currentTarget.dataset.id
            },
            success: function(e) {
                0 == e.code ? n.setData({
                    hide: 0,
                    qrcode: e.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(e) {
        this.setData({
            hide: 1
        });
    },
    orderRevoke: function() {
        var t = this;
        wx.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmtext: "是",
            success: function(n) {
                n.confirm && (wx.showLoading({
                    title: "操作中"
                }), o.request({
                    url: e.group.order.revoke,
                    data: {
                        order_id: t.data.order_info.order_id
                    },
                    success: function(e) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(e) {
                                e.confirm && t.loadOrderDetails();
                            }
                        });
                    }
                }));
            }
        });
    }
});