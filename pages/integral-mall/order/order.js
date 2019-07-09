var t = require("../../../api.js"), e = getApp();

Page({
    data: {
        hide: 1
    },
    onLoad: function(t) {
        getApp().pageOnLoad(this), this.loadOrderList(t.status || 0);
    },
    loadOrderList: function(a) {
        var i = this;
        void 0 == a && (a = -1), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.integral.list,
            data: {
                status: a
            },
            success: function(t) {
                0 == t.code && i.setData({
                    order_list: t.data.list,
                    status: a
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    orderSubmitPay: function(a) {
        var i = a.currentTarget.dataset;
        wx.showLoading({
            title: "提交中",
            mask: !0
        }), e.request({
            url: t.integral.order_submit,
            data: {
                id: i.id
            },
            success: function(t) {
                0 == t.code ? (wx.hideLoading(), wx.requestPayment({
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    complete: function(t) {
                        "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" == t.errMsg && wx.redirectTo({
                            url: "/pages/integral-mall/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认"
                        });
                    }
                })) : (wx.hideLoading(), wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "确认"
                }));
            }
        });
    },
    orderRevoke: function(a) {
        var i = this;
        wx.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(o) {
                if (o.cancel) return !0;
                o.confirm && (wx.showLoading({
                    title: "操作中"
                }), e.request({
                    url: t.integral.revoke,
                    data: {
                        order_id: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && i.loadOrderList(i.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    orderConfirm: function(a) {
        var i = this;
        wx.showModal({
            title: "提示",
            content: "是否确认已收到货？",
            cancelText: "否",
            confirmText: "是",
            success: function(o) {
                if (o.cancel) return !0;
                o.confirm && (wx.showLoading({
                    title: "操作中"
                }), e.request({
                    url: t.integral.confirm,
                    data: {
                        order_id: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showToast({
                            title: t.msg
                        }), 0 == t.code && i.loadOrderList(3);
                    }
                }));
            }
        });
    },
    orderQrcode: function(a) {
        var i = this, o = i.data.order_list, n = a.target.dataset.index;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.integral.get_qrcode,
            data: {
                order_no: o[n].order_no
            },
            success: function(t) {
                0 == t.code ? i.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    }
});