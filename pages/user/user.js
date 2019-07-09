var e = require("../../api.js"),
  a = getApp();

Page({
  data: {
    contact_tel: "",
    show_customer_service: 0
  },
  onLoad: function(e) {
    a.pageOnLoad(this);
  },
  loadData: function(t) {
    var n = this;
    n.setData({
      store: wx.getStorageSync("store")
    });
    var o = wx.getStorageSync("pages_user_user");
    o && n.setData(o), a.request({
      url: e.user.index,
      success: function(e) {
        0 == e.code && (n.setData(e.data), wx.setStorageSync("pages_user_user", e.data),
          wx.setStorageSync("share_setting", e.data.share_setting), wx.setStorageSync("user_info", e.data.user_info),
          console.log(e.data));
      }
    });
  },
  onReady: function() {},
  onShow: function() {
    a.pageOnShow(this), this.loadData();
  },
  callTel: function(e) {
    var a = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: a
    });
  },
  apply: function(t) {
    var n = wx.getStorageSync("share_setting"),
      o = wx.getStorageSync("user_info");
    console.log(t), 1 == n.share_condition ? wx.navigateTo({
      url: "/pages/add-share/index"
    }) : 0 != n.share_condition && 2 != n.share_condition || (0 == o.is_distributor ? wx.showModal({
      title: "申请成为分销商",
      content: "是否申请？",
      success: function(s) {
        s.confirm && (wx.showLoading({
          title: "正在加载",
          mask: !0
        }), a.request({
          url: e.share.join,
          method: "POST",
          data: {
            form_id: t.detail.formId
          },
          success: function(e) {
            0 == e.code && (0 == n.share_condition ? (o.is_distributor = 2, wx.navigateTo({
              url: "/pages/add-share/index"
            })) : (o.is_distributor = 1, wx.navigateTo({
              url: "/pages/share/index"
            })), wx.setStorageSync("user_info", o));
          },
          complete: function() {
            wx.hideLoading();
          }
        }));
      }
    }) : wx.navigateTo({
      url: "/pages/add-share/index"
    }));
  },
  verify: function(e) {
    wx.scanCode({
      onlyFromCamera: !1,
      success: function(e) {
        console.log(e), wx.navigateTo({
          url: "/" + e.path
        });
      },
      fail: function(e) {
        wx.showToast({
          title: "失败"
        });
      }
    });
  },
  member: function() {
    wx.navigateTo({
      url: "/pages/member/member"
    });
  },
  integral_mall: function(e) {
    wx.navigateTo({
      url: "/pages/integral-mall/index/index"
    });
  },
  tointegral: function() {
    wx.navigateTo({
      url: '/pages/integral-detail/integral-detail',
    })
  }
});