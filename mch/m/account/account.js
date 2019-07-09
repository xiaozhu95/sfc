var a = require("../../../api.js"),
    t = getApp();
Page({
    data: {
        cash_val: ""
    },
    onLoad: function(s) {
        t.pageOnLoad(this);
        var o = this,
            c = wx.getStorageSync("mch_account_data");
        c && o.setData(c), wx.showNavigationBarLoading(), t.request({
            url: a.mch.user.account,
            success: function(a) {
                0 == a.code ? (o.setData(a.data), wx.setStorageSync("mch_account_data", a.data)) : wx.showModal({
                    title: "提示",
                    content: a.msg,
                    success: function() {}
                })
            },
            complete: function() {
                wx.hideNavigationBarLoading()
            }
        })
    },
    onReady: function() {
        t.pageOnReady(this)
    },
    onShow: function() {
        t.pageOnShow(this)
    },
    onHide: function() {
        t.pageOnHide(this)
    },
    onUnload: function() {
        t.pageOnUnload(this)
    },
    showDesc: function() {
        var a = this;
        wx.showModal({
            title: "交易手续费说明",
            content: a.data.desc,
            showCancel: !1
        })
    },
    showCash: function() {
        var a = this;
        a.data.account_money < 1 ? a.showToast({
            title: "账户余额低于1元，无法提现。"
        }) : a.setData({
            show_cash: !0,
            cash_val: ""
        })
    },
    hideCash: function() {
        this.setData({
            show_cash: !1
        })
    },
    cashInput: function(a) {
        var t = this,
            s = a.detail.value;
        s = parseFloat(s), isNaN(s) && (s = 0), s = s.toFixed(2), t.setData({
            cash_val: s || ""
        })
    },
    cashSubmit: function(s) {
        var o = this;
        o.data.cash_val ? o.data.cash_val <= 0 ? o.showToast({
            title: "请输入提现金额。"
        }) : (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), t.request({
            url: a.mch.user.cash,
            method: "POST",
            data: {
                cash_val: o.data.cash_val
            },
            success: function(a) {
                wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function() {
                        0 == a.code && wx.redirectTo({
                            url: "/mch/m/account/account"
                        })
                    }
                })
            },
            complete: function(a) {
                wx.hideLoading()
            }
        })) : o.showToast({
            title: "请输入提现金额。"
        })
    }
});