var e = require("../../api.js"),
  a = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

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
          n.setData({
            call:e.data.user_info.binding
          })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    a.pageOnShow(this), this.loadData();
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