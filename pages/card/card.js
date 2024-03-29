var t = require("../../api.js"),
  a = getApp(),
  o = !1;

Page({
  data: {
    page: 1,
    show_qrcode: !1,
    status: 1
  },
  onLoad: function(t) {
    a.pageOnLoad(this), t.status && this.setData({
      status: t.status
    }), this.loadData();
  },
  loadData: function() {
    var o = this;
    wx.showLoading({
      title: "加载中"
    }), a.request({
      url: t.user.card,
      data: {
        page: 1,
        status: o.data.status
      },
      success: function(t) {
        0 == t.code && o.setData(t.data);
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },
  toRule(e) {
    console.log(e);
    var store_id = e.currentTarget.dataset.store;
    var card_id = e.currentTarget.dataset.card;
    wx.navigateTo({
      url: '/pages/usage/usage?store=' + store_id + '&card=' + card_id,
    })
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {
    this.data.page != this.data.page_count && this.loadMore();
  },
  loadMore: function() {
    var e = this;
    if (!o) {
      o = !0, wx.showLoading({
        title: "加载中"
      });
      var s = e.data.page;
      a.request({
        url: t.user.card,
        data: {
          page: s + 1,
          status: e.data.status
        },
        success: function(t) {
          if (0 == t.code) {
            var a = e.data.list.concat(t.data.list);
            e.setData({
              list: a,
              page_count: t.data.page_count,
              row_count: t.data.row_count,
              page: s + 1
            });
          }
        },
        complete: function() {
          o = !1, wx.hideLoading();
        }
      });
    }
  },
  getQrcode: function(o) {
    var e = this,
      s = o.currentTarget.dataset.index,
      n = e.data.list[s];
    wx.showLoading({
      title: "加载中"
    }), a.request({
      url: t.user.card_qrcode,
      data: {
        user_card_id: n.id
      },
      success: function(t) {
        0 == t.code ? e.setData({
          show_qrcode: !0,
          qrcode: t.data.url
        }) : wx.showModal({
          title: "提示",
          content: t.msg,
          showCancel: !1
        });
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },
  hide: function() {
    this.setData({
      show_qrcode: !1
    });
  },
  goto: function(t) {
    var a = t.currentTarget.dataset.status;
    wx.redirectTo({
      url: "/pages/card/card?status=" + a
    });
  },
  save: function() {
    var t = this;
    wx.saveImageToPhotosAlbum ? (wx.showLoading({
      title: "正在保存图片",
      mask: !1
    }), wx.downloadFile({
      url: t.data.qrcode,
      success: function(a) {
        wx.showLoading({
          title: "正在保存图片",
          mask: !1
        }), t.saveImg(a);
      },
      fail: function(a) {
        console.log(a);
        wx.showModal({
          title: "下载失败",
          content: a.errMsg + ";" + t.data.goods_qrcode,
          showCancel: !1
        });
      },
      complete: function(t) {
        console.log(t), wx.hideLoading();
      }
    })) : wx.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    });
  },
  saveImg: function(t) {
    var o = this;
    wx.saveImageToPhotosAlbum({
      filePath: t.tempFilePath,
      success: function() {
        wx.showModal({
          title: "提示",
          content: "保存成功",
          showCancel: !1
        });
      },
      fail: function(t) {
        wx.getSetting({
          success: function(e) {
            e.authSetting["scope.writePhotosAlbum"] || a.getauth({
              content: "小程序需要授权保存到相册",
              success: function(a) {
                a && (console.log(a), o.saveImg(t));
              }
            });
          }
        });
      },
      complete: function(t) {
        wx.hideLoading();
      }
    });
  }
});