var t = require("../../api.js"),
    a = require("../../utils.js"),
    o = getApp();
Page({
    data: {
        tab: 1,
        sort: 1,
        coupon_list: []
    },
    onLoad: function(t) {
      console.log(t);
      console.log(t.goods_id);
        o.pageOnLoad(this);
        var e = this;
        if (t.scene) {
            console.log("---scene raw---\x3e", t.scene);
            var s = decodeURIComponent(t.scene);
            s && (s = a.scene_decode(s), console.log("---scene decode---\x3e", s), s.mch_id && (t.mch_id = s.mch_id))
        }
        e.setData({
            tab: t.tab || 1,
            sort: t.sort || 1,
            mch_id: t.mch_id || !1,
            cat_id: t.cat_id || "",
            goods_id:t.goods_id || ''
        }), e.data.mch_id || wx.showModal({
            title: "提示",
            content: "店铺不存在！店铺id为空"
        }), setInterval(function() {
            e.onScroll()
        }, 40), this.getShopData()
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
    onReachBottom: function() {
        this.getGoodsList()
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.data.shop ? t.data.shop.name : "商城首页"
        }
    },
    onScroll: function(t) {
        var a = this;
        wx.createSelectorQuery().selectViewport(".after-navber").scrollOffset(function(t) {
            var o = 2 == a.data.tab ? 136.5333 : 85.3333;
            t.scrollTop >= o ? a.setData({
                fixed: !0
            }) : a.setData({
                fixed: !1
            })
        }).exec()
    },
    getShopData: function() {
        var a = this,
            e = (a.data.current_page || 0) + 1,
            s = "shop_data_mch_id_" + a.data.mch_id,
            d = wx.getStorageSync(s);
        d && a.setData({
            shop: d.shop
        }), wx.showNavigationBarLoading(), a.setData({
            loading: !0
        }), o.request({
            url: t.mch.shop,
            data: {
                mch_id: a.data.mch_id,
                tab: a.data.tab,
                sort: a.data.sort,
                page: e,
                cat_id: a.data.cat_id,
                goods_id:a.data.goods_id
            },
            success: function(t) {
                1 != t.code ? 0 == t.code && (a.setData({
                    shop: t.data.shop,
                    coupon_list: t.data.coupon_list,
                    hot_list: t.data.goods_list,
                    goods_list: t.data.goods_list,
                    new_list: t.data.new_list,
                    current_page: e
                }), wx.setStorageSync(s, t.data)) : wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/index/index"
                        })
                    }
                })
            },
            complete: function() {
                wx.hideNavigationBarLoading(), a.setData({
                    loading: !1
                })
            }
        })
    },
    getGoodsList: function() {
        var a = this;
        if (3 != a.data.tab && !a.data.loading && !a.data.no_more) {
            a.setData({
                loading: !0
            });
            var e = (a.data.current_page || 0) + 1;
            o.request({
                url: t.mch.shop,
                data: {
                    mch_id: a.data.mch_id,
                    tab: a.data.tab,
                    sort: a.data.sort,
                    page: e,
                    cat_id: a.data.cat_id
                },
                success: function(t) {
                    0 == t.code && (1 == a.data.tab && (t.data.goods_list && t.data.goods_list.length ? (a.data.hot_list = a.data.hot_list.concat(t.data.goods_list), a.setData({
                        hot_list: a.data.hot_list,
                        current_page: e
                    })) : a.setData({
                        no_more: !0
                    })), 2 == a.data.tab && (t.data.goods_list && t.data.goods_list.length ? (a.data.goods_list = a.data.goods_list.concat(t.data.goods_list), a.setData({
                        goods_list: a.data.goods_list,
                        current_page: e
                    })) : a.setData({
                        no_more: !0
                    })))
                },
                complete: function() {
                    a.setData({
                        loading: !1
                    })
                }
            })
        }
    }
});