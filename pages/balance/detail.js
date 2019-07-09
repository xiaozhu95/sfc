var t = require("../../api.js"), e = getApp();

Page({
    data: {},
    onLoad: function(a) {
        e.pageOnLoad(this);
        var n = this;
        n.setData(a), wx.showLoading({
            title: "加载中"
        }), e.request({
            url: t.recharge.detail,
            method: "GET",
            data: {
                order_type: a.order_type,
                id: a.id
            },
            success: function(t) {
                wx.hideLoading(), 0 == t.code ? n.setData({
                    list: t.data
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg
                });
            }
        });
    },
    onReady: function() {
        e.pageOnReady(this);
    },
    onShow: function() {
        e.pageOnShow(this);
    },
    onHide: function() {
        e.pageOnHide(this);
    },
    onUnload: function() {
        e.pageOnUnload(this);
    }
});