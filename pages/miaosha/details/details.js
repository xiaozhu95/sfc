var t = require("../../../api.js"), a = require("../../../utils.js"), o = getApp(), e = require("../../../wxParse/wxParse.js"), i = 1, s = !1, r = !0, n = 0;

Page({
    data: {
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: wx.getSystemInfoSync().windowWidth,
        y: wx.getSystemInfoSync().windowHeight - 20,
        miaosha_end_time_over: {
            h: "--",
            m: "--",
            s: "--",
            type: 0
        }
    },
    onLoad: function(t) {
        o.pageOnLoad(this), n = 0, i = 1, s = !1, r = !0, this.setData({
            store: wx.getStorageSync("store")
        });
        var e = 0, d = t.user_id;
        console.log("options=>" + JSON.stringify(t));
        var c = decodeURIComponent(t.scene), u = 0;
        if (void 0 != d) e = d; else if (void 0 != c) {
            console.log("scene string=>" + c);
            var _ = a.scene_decode(c);
            console.log("scene obj=>" + JSON.stringify(_)), _.uid && _.gid ? (u = 1, e = _.uid, 
            t.id = _.gid) : e = c;
        }
        o.loginBindParent({
            parent_id: e
        });
        var l = this;
        l.setData({
            id: t.id,
            scene_type: u
        }), l.getGoods(), l.getCommentList();
    },
    getGoods: function() {
        var a = this;
        o.request({
            url: t.miaosha.details,
            data: {
                id: a.data.id,
                scene_type: a.data.scene_type
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = t.data.detail;
                    e.wxParse("detail", "html", o, a), a.setData({
                        goods: t.data,
                        attr_group_list: t.data.attr_group_list,
                        miaosha_data: t.data.miaosha.miaosha_data
                    }), 1 == a.data.scene_type && a.setData({
                        id: t.data.miaosha.miaosha_goods_id
                    }), a.data.goods.miaosha && a.setMiaoshaTimeOver(), a.selectDefaultAttr();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var o in t.data.attr_group_list[a].attr_list) 0 == a && 0 == o && (t.data.attr_group_list[a].attr_list[o].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(a) {
        var e = this;
        a && "active" != e.data.tab_comment || s || r && (s = !0, o.request({
            url: t.miaosha.comment_list,
            data: {
                goods_id: e.data.id,
                page: i
            },
            success: function(t) {
                0 == t.code && (s = !1, i++, e.setData({
                    comment_count: t.data.comment_count,
                    comment_list: a ? e.data.comment_list.concat(t.data.list) : t.data.list
                }), 0 == t.data.list.length && (r = !1));
            }
        }));
    },
    onGoodsImageClick: function(t) {
        var a = this, o = [], e = t.currentTarget.dataset.index;
        for (var i in a.data.goods.pic_list) o.push(a.data.goods.pic_list[i].pic_url);
        wx.previewImage({
            urls: o,
            current: o[e]
        });
    },
    numberSub: function() {
        var t = this, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this, a = t.data.form.number;
        if (++a > t.data.goods.miaosha.buy_max && 0 != t.data.goods.miaosha.buy_max) return wx.showToast({
            title: "一单限购" + t.data.goods.miaosha.buy_max + "件",
            image: "/images/icon-warning.png"
        }), !0;
        t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, o = t.detail.value;
        o = parseInt(o), isNaN(o) && (o = 1), o <= 0 && (o = 1), o > a.data.goods.miaosha.buy_max && 0 != a.data.goods.miaosha.buy_max && (wx.showToast({
            title: "一单限购" + a.data.goods.miaosha.buy_max + "件",
            image: "/images/icon-warning.png"
        }), o = a.data.goods.miaosha.buy_max), a.setData({
            form: {
                number: o
            }
        });
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.data.goods.miaosha ? this.submit("BUY_NOW") : wx.showModal({
            title: "提示",
            content: "秒杀商品当前时间暂无活动",
            showCancel: !1,
            success: function(t) {}
        });
    },
    submit: function(a) {
        var e = this;
        if (!e.data.show_attr_picker) return e.setData({
            show_attr_picker: !0
        }), !0;
        if (e.data.miaosha_data && e.data.miaosha_data.rest_num > 0 && e.data.form.number > e.data.miaosha_data.rest_num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (e.data.form.number > e.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var i = e.data.attr_group_list, s = [];
        for (var r in i) {
            var n = !1;
            for (var d in i[r].attr_list) if (i[r].attr_list[d].checked) {
                n = {
                    attr_id: i[r].attr_list[d].attr_id,
                    attr_name: i[r].attr_list[d].attr_name
                };
                break;
            }
            if (!n) return wx.showToast({
                title: "请选择" + i[r].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            s.push({
                attr_group_id: i[r].attr_group_id,
                attr_group_name: i[r].attr_group_name,
                attr_id: n.attr_id,
                attr_name: n.attr_name
            });
        }
        "ADD_CART" == a && (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), o.request({
            url: t.cart.add_cart,
            method: "POST",
            data: {
                goods_id: e.data.id,
                attr: JSON.stringify(s),
                num: e.data.form.number
            },
            success: function(t) {
                wx.showToast({
                    title: t.msg,
                    duration: 1500
                }), wx.hideLoading(), e.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == a && (e.setData({
            show_attr_picker: !1
        }), wx.redirectTo({
            url: "/pages/miaosha/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: e.data.id,
                attr: s,
                num: e.data.form.number
            })
        }));
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.setData({
            show_attr_picker: !0
        });
    },
    attrClick: function(a) {
        var e = this, i = a.target.dataset.groupId, s = a.target.dataset.id, r = e.data.attr_group_list;
        for (var n in r) if (r[n].attr_group_id == i) for (var d in r[n].attr_list) r[n].attr_list[d].attr_id == s ? r[n].attr_list[d].checked = !0 : r[n].attr_list[d].checked = !1;
        e.setData({
            attr_group_list: r
        });
        var c = [], u = !0;
        for (var n in r) {
            var _ = !1;
            for (var d in r[n].attr_list) if (r[n].attr_list[d].checked) {
                c.push(r[n].attr_list[d].attr_id), _ = !0;
                break;
            }
            if (!_) {
                u = !1;
                break;
            }
        }
        u && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: t.default.goods_attr_info,
            data: {
                goods_id: e.data.id,
                attr_list: JSON.stringify(c),
                type: "ms"
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = e.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, e.setData({
                        goods: a,
                        miaosha_data: t.data.miaosha
                    });
                }
            }
        }));
    },
    favoriteAdd: function() {
        var a = this;
        o.request({
            url: t.user.favorite_add,
            method: "post",
            data: {
                goods_id: a.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = a.data.goods;
                    o.is_favorite = 1, a.setData({
                        goods: o
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var a = this;
        o.request({
            url: t.user.favorite_remove,
            method: "post",
            data: {
                goods_id: a.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = a.data.goods;
                    o.is_favorite = 0, a.setData({
                        goods: o
                    });
                }
            }
        });
    },
    tabSwitch: function(t) {
        var a = this;
        "detail" == t.currentTarget.dataset.tab ? a.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : a.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        console.log(t);
        var a = this, o = t.currentTarget.dataset.index, e = t.currentTarget.dataset.picIndex;
        wx.previewImage({
            current: a.data.comment_list[o].pic_list[e],
            urls: a.data.comment_list[o].pic_list
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getCommentList(!0);
    },
    onShareAppMessage: function() {
        var t = this, a = wx.getStorageSync("user_info");
        return {
            path: "/pages/miaosha/details/details?id=" + this.data.id + "&user_id=" + a.id,
            success: function(a) {
                console.log(a), 1 == ++n && o.shareSendCoupon(t);
            },
            title: t.data.goods.name,
            imageUrl: t.data.goods.pic_list[0].pic_url
        };
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), wx.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), wx.createVideoContext("video").pause();
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    showShareModal: function() {
        // this.setData({
        //     share_modal_active: "active",
        //     no_scroll: !0
        // });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var a = this;
        if (a.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), a.data.goods_qrcode) return !0;
        o.request({
            url: t.miaosha.goods_qrcode,
            data: {
                goods_id: a.data.id
            },
            success: function(t) {
                0 == t.code && a.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (a.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveGoodsQrcode: function() {
        var t = this;
        wx.saveImageToPhotosAlbum ? (wx.showLoading({
            title: "正在保存图片",
            mask: !1
        }), wx.downloadFile({
            url: t.data.goods_qrcode,
            success: function(t) {
                wx.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function() {
                        wx.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(t) {
                        console.log(t), wx.hideLoading();
                    }
                });
            },
            fail: function(a) {
                wx.showModal({
                    title: "图片下载失败",
                    content: a.errMsg + ";" + t.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                console.log(t), wx.hideLoading();
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            showCancel: !1
        });
    },
    goodsQrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        wx.previewImage({
            urls: [ a ]
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setMiaoshaTimeOver: function() {
        function t() {
            var t = o.data.goods.miaosha.end_time - o.data.goods.miaosha.now_time;
            t = t < 0 ? 0 : t, o.data.goods.miaosha.now_time++, o.setData({
                goods: o.data.goods,
                miaosha_end_time_over: a(t)
            });
        }
        function a(t) {
            var a = parseInt(t / 3600), o = parseInt(t % 3600 / 60), e = t % 60, i = 0;
            return a >= 1 && (a -= 1, i = 1), {
                h: a < 10 ? "0" + a : "" + a,
                m: o < 10 ? "0" + o : "" + o,
                s: e < 10 ? "0" + e : "" + e,
                type: i
            };
        }
        var o = this;
        t(), setInterval(function() {
            t();
        }, 1e3);
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    }
});