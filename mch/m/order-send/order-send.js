var e = require("../../../api.js"),
    o = getApp();
Page({
    data: {
        order: {}
    },
    onLoad: function(t) {
        o.pageOnLoad(this);
        var a = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: e.mch.order.detail,
            data: {
                id: t.id
            },
            success: function(e) {
                0 == e.code ? a.setData({
                    order: e.data.order
                }) : wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.navigateBack()
                    }
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    },
    onReady: function() {
        o.pageOnReady(this)
    },
    onShow: function() {
        o.pageOnShow(this)
    },
    onHide: function() {
        o.pageOnHide(this)
    },
    onUnload: function() {
        o.pageOnUnload(this)
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    expressChange: function(e) {
        var o = this;
        o.data.order.default_express = o.data.order.express_list[e.detail.value].express, o.setData({
            order: o.data.order
        })
    },
    expressInput: function(e) {
        var o = this;
        console.log(e), o.data.order.default_express = e.detail.value
    },
    expressNoInput: function(e) {
        var o = this;
        console.log(e), o.data.order.express_no = e.detail.value
    },
    wordsInput: function(e) {
        var o = this;
        console.log(e), o.data.order.words = e.detail.value
    },
    formSubmit: function(t) {
        var a = this;
        console.log(t), wx.showLoading({
            title: "正在提交",
            mask: !0
        }), o.request({
            url: e.mch.order.send,
            method: "post",
            data: {
                send_type: "express",
                order_id: a.data.order.id,
                express: t.detail.value.express,
                express_no: t.detail.value.express_no,
                words: t.detail.value.words
            },
            success: function(e) {
                wx.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && 0 == e.code && wx.navigateBack()
                    }
                })
            },
            complete: function(e) {
                wx.hideLoading()
            }
        })
    }
});