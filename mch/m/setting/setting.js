var t = require("../../../api.js"),
    a = require("../../../area-picker/area-picker.js"),
    o = getApp();
Page({
    data: {},
    onLoad: function(i) {
        o.pageOnLoad(this);
        var e = this;
        e.getDistrictData(function(t) {
            a.init({
                page: e,
                data: t
            })
        }), wx.showLoading({
            title: "正在加载"
        }), o.request({
            url: t.mch.user.setting,
            success: function(t) {
                wx.hideLoading(), e.setData(t.data)
            }
        })
    },
    getDistrictData: function(a) {
        var i = wx.getStorageSync("district");
        if (!i) return wx.showLoading({
            title: "正在加载",
            mask: !0
        }), void o.request({
            url: t.
            default.district,
            success: function(t) {
                wx.hideLoading(), 0 == t.code && (i = t.data, wx.setStorageSync("district", i), a(i))
            }
        });
        a(i)
    },
    onAreaPickerConfirm: function(t) {
        this.setData({
            edit_district: {
                province: {
                    id: t[0].id,
                    name: t[0].name
                },
                city: {
                    id: t[1].id,
                    name: t[1].name
                },
                district: {
                    id: t[2].id,
                    name: t[2].name
                }
            }
        })
    },
    mchCommonCatChange: function(t) {
        this.setData({
            mch_common_cat_index: t.detail.value
        })
    },
    formSubmit: function(a) {
        var i = this;
        console.log(a), wx.showLoading({
            title: "正在提交",
            mask: !0
        }), a.detail.value.form_id = a.detail.formId, a.detail.value.mch_common_cat_id = i.data.mch_common_cat_index ? i.data.mch_common_cat_list[i.data.mch_common_cat_index].id : i.data.mch && i.data.mch.mch_common_cat_id ? i.data.mch.mch_common_cat_id : "", o.request({
            url: t.mch.user.setting_submit,
            method: "post",
            data: a.detail.value,
            success: function(t) {
                wx.hideLoading(), 0 == t.code ? wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: 1
                        })
                    }
                }) : i.showToast({
                    title: t.msg
                })
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
    uploadLogo: function() {
        var t = this;
        o.uploader.upload({
            start: function(t) {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                })
            },
            success: function(a) {
                0 == a.code ? (t.data.mch.logo = a.data.url, t.setData({
                    mch: t.data.mch
                })) : t.showToast({
                    title: a.msg
                })
            },
            error: function(a) {
                console.log(a), t.showToast({
                    title: a
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    },
    uploadHeaderBg: function() {
        var t = this;
        o.uploader.upload({
            start: function(t) {
                wx.showLoading({
                    title: "正在上传",
                    mask: !0
                })
            },
            success: function(a) {
                0 == a.code ? (t.data.mch.header_bg = a.data.url, t.setData({
                    mch: t.data.mch
                })) : t.showToast({
                    title: a.msg
                })
            },
            error: function(a) {
                console.log(a), t.showToast({
                    title: a
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        })
    }
});