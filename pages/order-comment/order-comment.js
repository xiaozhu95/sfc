var t = require("../../api.js"), e = getApp();

Page({
    data: {
        goods_list: []
    },
    onLoad: function(o) {
        e.pageOnLoad(this);
        var a = this;
        if (o.inId) i = {
            order_id: o.inId,
            type: "IN"
        }; else var i = {
            order_id: o.id,
            type: "mall"
        };
        a.setData({
            order_id: i.order_id,
            type: i.type
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.order.comment_preview,
            data: i,
            success: function(t) {
                if (wx.hideLoading(), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), 0 == t.code) {
                    for (var e in t.data.goods_list) t.data.goods_list[e].score = 3, t.data.goods_list[e].content = "", 
                    t.data.goods_list[e].pic_list = [], t.data.goods_list[e].uploaded_pic_list = [];
                    a.setData({
                        goods_list: t.data.goods_list
                    });
                }
            }
        });
    },
    setScore: function(t) {
        var e = this, o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.score, i = e.data.goods_list;
        i[o].score = a, e.setData({
            goods_list: i
        });
    },
    contentInput: function(t) {
        var e = this, o = t.currentTarget.dataset.index;
        e.data.goods_list[o].content = t.detail.value, e.setData({
            goods_list: e.data.goods_list
        });
    },
    chooseImage: function(t) {
        var e = this, o = t.currentTarget.dataset.index, a = e.data.goods_list, i = a[o].pic_list.length;
        wx.chooseImage({
            count: 6 - i,
            success: function(t) {
                a[o].pic_list = a[o].pic_list.concat(t.tempFilePaths), e.setData({
                    goods_list: a
                });
            }
        });
    },
    deleteImage: function(t) {
        var e = this, o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.picIndex, i = e.data.goods_list;
        i[o].pic_list.splice(a, 1), e.setData({
            goods_list: i
        });
    },
    commentSubmit: function(o) {
        function a(e) {
            if (e == n.length) return i();
            var o = 0;
            if (!n[e].pic_list.length || 0 == n[e].pic_list.length) return a(e + 1);
            for (var s in n[e].pic_list) !function(i) {
                wx.uploadFile({
                    url: t.default.upload_image,
                    name: "image",
                    formData: c,
                    filePath: n[e].pic_list[i],
                    complete: function(t) {
                        if (console.log(t), t.data) {
                            var s = JSON.parse(t.data);
                            0 == s.code && (n[e].uploaded_pic_list[i] = s.data.url);
                        }
                        if (++o == n[e].pic_list.length) return a(e + 1);
                    }
                });
            }(s);
        }
        function i() {
            e.request({
                url: t.order.comment,
                method: "post",
                data: {
                    order_id: s.data.order_id,
                    goods_list: JSON.stringify(n),
                    type: s.data.type
                },
                success: function(t) {
                    wx.hideLoading(), 0 == t.code && wx.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(e) {
                            e.confirm && ("IN" == t.type ? wx.redirectTo({
                                url: "/pages/integral-mall/order/order?status=3"
                            }) : wx.redirectTo({
                                url: "/pages/order/order?status=3"
                            }));
                        }
                    }), 1 == t.code && wx.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
        }
        var s = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        });
        var n = s.data.goods_list, d = e.siteInfo, c = {};
        -1 != d.uniacid && "-1" != d.acid && (c._uniacid = d.uniacid, c._acid = d.acid), 
        a(0);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});