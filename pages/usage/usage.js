var t = require("../../api.js"),
  a = getApp(),
  o = !1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // markers: [{
    //   id: 1,
    //   latitude: 23.099994,
    //   longitude: 113.324520,
    //   name: 'T.I.T 创意园'
    // }],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 80
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getQrcode() {
    var e = this;
    var card_id = this.options.card;
    wx.showLoading({
      title: "加载中"
    }), a.request({
      url: t.user.card_qrcode,
      data: {
        user_card_id: card_id
      },
      success: function(t) {
        console.log(t);
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
  copyText(event) {
    var content = event.currentTarget.dataset.text;
    wx.setClipboardData({
      data: content,
      success: function() {
        wx.showToast({
          title: "已复制"
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getQrcode();
    var store_id = this.options.store;
    var card_id = this.options.card;
    var that = this;
    this.setData({
      user_name: wx.getStorageSync("user_info").nickname
    })
    wx.request({
      url: 'https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/user/user-card-detail',
      method: 'GET',
      data: {
        user_card_id: card_id,
        store_id: store_id,
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9
      },
      success(res) {
        console.log(res);
        var markers = [{
          id: 1,
          latitude: res.data.data.list[0].latitude,
          longitude: res.data.data.list[0].longitude,
          name: res.data.data.list[0].mchName
        }];
        that.setData({
          copud_detail: res.data.data.list[0],
          markers: markers
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})