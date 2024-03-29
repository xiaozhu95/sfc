var e = require("../../api.js"), t = getApp();

Page({
    data: {},
    onLoad: function(e) {
        t.pageOnLoad(this);
    },
    onReady: function() {
        t.pageOnReady(this);
    },
    onShow: function() {
        t.pageOnShow(this);
    },
    onHide: function() {
        t.pageOnHide(this);
    },
    onUnload: function() {
        t.pageOnUnload(this);
    },
    getUserInfo: function(t) {
        console.log("getUserInfo----------\x3e", t), "getUserInfo:ok" == t.detail.errMsg && (wx.showLoading({
            title: "正在登录",
            mask: !0
        }), wx.login({
            success: function(o) {
                var n = o.code;
                getApp().request({
                    url: e.passport.login,
                    method: "POST",
                    data: {
                        code: n,
                        user_info: t.detail.rawData,
                        encrypted_data: t.detail.encryptedData,
                        iv: t.detail.iv,
                        signature: t.detail.signature
                    },
                    success: function(e) {
                      console.log(e);
                        if (0 == e.code) {
                            wx.setStorageSync("access_token", e.data.access_token), wx.setStorageSync("user_info", e.data);
                            var t = wx.getStorageSync("login_pre_page");
                            t && t.route || wx.redirectTo({
                                url: "/pages/index/index"
                            });
                            var o = 0;
                            (o = t.options && t.options.user_id ? t.options.user_id : t.options && t.options.scene ? t.options.scene : wx.getStorageSync("parent_id")) && 0 != o && getApp().bindParent({
                                parent_id: o
                            }), wx.redirectTo({
                                url: "/" + t.route + "?" + getApp().utils.objectToUrlParams(t.options)
                            });
                        } else wx.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                });
            },
            fail: function(e) {}
        }));
    }
});