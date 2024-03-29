var t = require("../../api.js"),
    e = require("../../area-picker/area-picker.js"),
    a = getApp();
Page({
    data: {},
    onLoad: function(i) {
        a.pageOnLoad(this);
        var n = this;
        n.getDistrictData(function(t) {
            e.init({
                page: n,
                data: t
            })
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.mch.apply,
            success: function(t) {
                wx.hideLoading(), 0 == t.code && (t.data.apply && (t.data.show_result = !0), n.setData(t.data))
            }
        })
    },
    getDistrictData: function(e) {
        var i = wx.getStorageSync("district");
        if (!i) return wx.showLoading({
            title: "正在加载",
            mask: !0
        }), void a.request({
            url: t.
            default.district,
            success: function(t) {
                wx.hideLoading(), 0 == t.code && (i = t.data, wx.setStorageSync("district", i), e(i))
            }
        });
        e(i)
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
    onReady: function() {
        a.pageOnReady(this)
    },
    onShow: function() {
        a.pageOnShow(this)
    },
    onHide: function() {
        a.pageOnHide(this)
    },
    onUnload: function() {
        a.pageOnUnload(this)
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    mchCommonCatChange: function(t) {
        this.setData({
            mch_common_cat_index: t.detail.value
        })
    },
    applySubmit: function(e) {
        console.log(e);
        var i = this;
        !i.data.entry_rules || i.data.agree_entry_rules ? (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), a.request({
            url: t.mch.apply_submit,
            method: "post",
            data: {
                realname: e.detail.value.realname,
                // intro: '你好啊哈哈哈哈',
                tel: e.detail.value.tel,
                name: e.detail.value.name,
                province_id: e.detail.value.province_id,
                city_id: e.detail.value.city_id,
                district_id: e.detail.value.district_id,
                address: e.detail.value.address,
                mch_common_cat_id: i.data.mch_common_cat_index ? i.data.mch_common_cat_list[i.data.mch_common_cat_index].id : i.data.apply && i.data.apply.mch_common_cat_id ? i.data.apply.mch_common_cat_id : "",
                service_tel: e.detail.value.service_tel,
                form_id: e.detail.formId
            },
            success: function(t) {
                wx.hideLoading(), 0 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/mch/apply/apply"
                        })
                    }
                }), 1 == t.code && i.showToast({
                    title: t.msg
                })
            }
        })) : wx.showModal({
            title: "提示",
            content: "请先阅读并同意《入驻协议》。",
            showCancel: !1
        })
    },
    hideApplyResult: function() {
        this.setData({
            show_result: !1
        })
    },
    showApplyResult: function() {
        this.setData({
            show_result: !0
        })
    },
    showEntryRules: function() {
        this.setData({
            show_entry_rules: !0
        })
    },
    disagreeEntryRules: function() {
        this.setData({
            agree_entry_rules: !1,
            show_entry_rules: !1
        })
    },
    agreeEntryRules: function() {
        this.setData({
            agree_entry_rules: !0,
            show_entry_rules: !1
        })
    }
});