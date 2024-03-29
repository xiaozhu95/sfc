var t = require("../../api.js"), e = getApp();

Page({
    data: {
        total_price: 0,
        price: 0,
        cash_price: 0,
        total_cash: 0,
        team_count: 0,
        order_money: 0
    },
    onLoad: function(t) {
        e.pageOnLoad(this), this.setData({
            custom: wx.getStorageSync("custom")
        });
    },
    onReady: function() {},
    onShow: function() {
        e.pageOnShow(this);
        var a = this, o = wx.getStorageSync("share_setting"), i = a.data.__user_info;
        a.setData({
            share_setting: o
        }), i && 1 == i.is_distributor ? (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.share.get_info,
            success: function(t) {
                0 == t.code && (a.setData({
                    total_price: t.data.price.total_price,
                    price: t.data.price.price,
                    cash_price: t.data.price.cash_price,
                    total_cash: t.data.price.total_cash,
                    team_count: t.data.team_count,
                    order_money: t.data.order_money,
                    custom: t.data.custom,
                    order_money_un: t.data.order_money_un
                }), wx.setStorageSync("custom", t.data.custom)), 1 == t.code && (i.is_distributor = t.data.is_distributor, 
                a.setData({
                    __user_info: i
                }), wx.setStorageSync("user_info", i));
            },
            complete: function() {
                wx.hideLoading();
            }
        })) : (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.share.index,
            success: function(t) {
                if (0 == t.code) {
                    if (t.data.share_setting) e = t.data.share_setting; else var e = t.data;
                    wx.setStorageSync("share_setting", e), a.setData({
                        share_setting: e
                    });
                }
            },
            complete: function() {
                wx.hideLoading();
            }
        }));
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    apply: function(a) {
        var o = wx.getStorageSync("share_setting"), i = wx.getStorageSync("user_info");
        1 == o.share_condition ? wx.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != o.share_condition && 2 != o.share_condition || (0 == i.is_distributor ? wx.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(n) {
                n.confirm && (wx.showLoading({
                    title: "正在加载",
                    mask: !0
                }), e.request({
                    url: t.share.join,
                    method: "POST",
                    data: {
                        form_id: a.detail.formId
                    },
                    success: function(t) {
                        0 == t.code && (0 == o.share_condition ? (i.is_distributor = 2, wx.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (i.is_distributor = 1, wx.navigateTo({
                            url: "/pages/share/index"
                        })), wx.setStorageSync("user_info", i));
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        }) : wx.navigateTo({
            url: "/pages/add-share/index"
        }));
    }
});