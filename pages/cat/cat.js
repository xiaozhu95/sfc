var t = require("../../api.js"),
  a = getApp(),
  e = !1,
  s = !1;

Page({
  data: {
    cat_list: [],
    sub_cat_list_scroll_top: 0,
    scrollLeft: 0,
    page: 1,
    cat_style: 0,
    height: 0,
    catheight: 120
  },
  onLoad: function(t) {
    a.pageOnLoad(this);
    var e = wx.getStorageSync("store"),
      s = t.cat_id;
      console.log(t);
    void 0 !== s && s && (this.data.cat_style = e.cat_style = -1, wx.showLoading({
      title: "正在加载",
      mask: !0
    }), this.childrenCat(s)), this.setData({
      store: e
    });
  },
  onShow: function() {
    wx.hideLoading(), a.pageOnShow(this), -1 !== this.data.cat_style && this.loadData();
  },
  loadData: function(e) {
    var s = this;
    if ("" == s.data.cat_list || 5 != wx.getStorageSync("store").cat_style && 4 != wx.getStorageSync("store").cat_style && 2 != wx.getStorageSync("store").cat_style) {
      var i = wx.getStorageSync("cat_list");
      i && s.setData({
        cat_list: i,
        current_cat: null
      }), a.request({
        url: t.default.cat_list,
        success: function(t) {
          0 == t.code && (s.data.cat_list = t.data.list, 5 === wx.getStorageSync("store").cat_style && s.goodsAll({
            currentTarget: {
              dataset: {
                index: 0
              }
            }
          }), 4 !== wx.getStorageSync("store").cat_style && 2 !== wx.getStorageSync("store").cat_style || s.catItemClick({
            currentTarget: {
              dataset: {
                index: 0
              }
            }
          }), 1 !== wx.getStorageSync("store").cat_style && 3 !== wx.getStorageSync("store").cat_style || (s.setData({
            cat_list: t.data.list,
            current_cat: null
          }), wx.setStorageSync("cat_list", t.data.list)));
        },
        complete: function() {
          wx.stopPullDownRefresh();
        }
      });
    } else s.setData({
      cat_list: s.data.cat_list,
      current_cat: s.data.current_cat
    });
  },
  childrenCat: function(s) {
    console.log(s,"走到子函数")
    var i = this;
    e = !1;
    i.data.page;
    a.request({
      url: t.default.cat_list,
      success: function(t) {
        console.log(t);
        if (0 == t.code) {
          var a = !0;
          for (var e in t.data.list) {
            t.data.list[e].id == s && (a = !1, i.data.current_cat = t.data.list[e], t.data.list[e].list.length > 0 ? (i.setData({
              catheight: 100
            }), i.firstcat({
              currentTarget: {
                dataset: {
                  index: 0
                }
              }
            })) : i.firstcat({
              currentTarget: {
                dataset: {
                  index: 0
                }
              }
            }, !1));
            for (var c in t.data.list[e].list) t.data.list[e].list[c].id == s && (a = !1, i.data.current_cat = t.data.list[e],
              i.goodsItem({
                currentTarget: {
                  dataset: {
                    index: e
                  }
                }
              }, !1));
          }
          a && i.setData({
            show_no_data_tip: !0
          });
        }
      },
      complete: function() {
        wx.stopPullDownRefresh(), wx.createSelectorQuery().select("#cat").boundingClientRect(function(t) {
          console.log("21分类" + t.height), i.setData({
            height: t.height
          });
        }).exec();
      }
    });
  },
  catItemClick: function(t) {
    var a = this,
      e = t.currentTarget.dataset.index,
      s = a.data.cat_list,
      i = null;
    for (var c in s) c == e ? (s[c].active = !0, !1, i = s[c]) : s[c].active = !1;
    console.log(i), a.setData({
      cat_list: s,
      sub_cat_list_scroll_top: 0,
      current_cat: i
    });
  },
  firstcat: function(t) {
    var a = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
      e = this.data.current_cat;
    this.setData({
      page: 1,
      goods_list: [],
      show_no_data_tip: !1,
      current_cat: a ? e : []
    }), this.list(e.id, 2);
  },
  goodsItem: function(t) {
    var a = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
      e = this,
      s = t.currentTarget.dataset.index,
      i = e.data.current_cat,
      c = 0;
    for (var o in i.list) s == o ? (i.list[o].active = !0, c = i.list[o].id) : i.list[o].active = !1;
    e.setData({
      page: 1,
      goods_list: [],
      show_no_data_tip: !1,
      current_cat: a ? i : []
    }), this.list(c, 2);
  },
  goodsAll: function(t) {
    var a = this,
      e = t.currentTarget.dataset.index,
      s = a.data.cat_list,
      i = null;
    for (var c in s) c == e ? (s[c].active = !0, i = s[c]) : s[c].active = !1;
    a.setData({
      page: 1,
      goods_list: [],
      show_no_data_tip: !1,
      cat_list: s,
      current_cat: i
    });
    var o = t.currentTarget.offsetLeft,
      l = a.data.scrollLeft;
    l = o - 80, a.setData({
      scrollLeft: l
    }), this.list(i.id, 1), wx.createSelectorQuery().select("#catall").boundingClientRect(function(t) {
      console.log("11分类" + t.height), a.setData({
        height: t.height
      });
    }).exec();
  },
  list: function(s, i) {
    var c = this;
    wx.showLoading({
      title: "正在加载",
      mask: !0
    }), e = !1;
    var o = c.data.page || 2;
    console.log(s,"达康书记")
    a.request({
      url: t.default.goods_list,
      data: {
        cat_id: s,
        page: o
      },
      success: function(t) {
        0 == t.code && (wx.hideLoading(), 0 == t.data.list.length && (e = !0), c.setData({
          page: o + 1
        }), c.setData({
          goods_list: t.data.list
        }), c.setData({
          cat_id: s
        })), c.setData({
          show_no_data_tip: 0 == c.data.goods_list.length
        });
      },
      complete: function() {
        1 == i && wx.createSelectorQuery().select("#catall").boundingClientRect(function(t) {
          console.log("12分类" + t.height), c.setData({
            height: t.height
          });
        }).exec();
      }
    });
  },
  onReachBottom: function() {
    var t = this;
    e || 5 != wx.getStorageSync("store").cat_style && -1 != t.data.cat_style || t.loadMoreGoodsList();
  },
  loadMoreGoodsList: function() {
    var i = this;
    if (!s) {
      i.setData({
        show_loading_bar: !0
      }), s = !0;
      var c = i.data.cat_id || "",
        o = i.data.page || 2;
        console.log(i.data.cat_id,"adadada");
      a.request({
        url: t.default.goods_list,
        data: {
          page: o,
          cat_id: c
        },
        success: function(t) {
          0 == t.data.list.length && (e = !0);
          var a = i.data.goods_list.concat(t.data.list);
          i.setData({
            goods_list: a,
            page: o + 1
          });
        },
        complete: function() {
          s = !1, i.setData({
            show_loading_bar: !1
          });
        }
      });
    }
  }
});