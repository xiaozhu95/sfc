var t = require("../../api.js"), a = getApp(), s = !1, n = !1, o = 2;

Page({
    data: {
        status: -1,
        cash_list: [],
        show_no_data_tip: !1
    },
    onLoad: function(t) {
        a.pageOnLoad(this), s = !1, n = !1, o = 2, this.LoadCashList(t.status || -1);
    },
    onReady: function() {},
    onShow: function() {},
    LoadCashList: function(s) {
        var n = this;
        n.setData({
            status: parseInt(s || -1)
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.share.cash_detail,
            data: {
                status: n.data.status
            },
            success: function(t) {
                0 == t.code && n.setData({
                    cash_list: t.data.list
                }), n.setData({
                    show_no_data_tip: 0 == n.data.cash_list.length
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var i = this;
        n || s || (n = !0, a.request({
            url: t.share.cash_detail,
            data: {
                status: i.data.status,
                page: o
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = i.data.cash_list.concat(t.data.list);
                    i.setData({
                        cash_list: a
                    }), 0 == t.data.list.length && (s = !0);
                }
                o++;
            },
            complete: function() {
                n = !1;
            }
        }));
    }
});