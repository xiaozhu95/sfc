// pages/pay_status/pay_status.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list: []
  },
  /*******去待付款页面*********/
  topay() {
    if (this.options.status == 0) {
      wx.redirectTo({
        url: '/pages/order/order?status=0',
      })
    }
    if (this.options.status == 1) {
      wx.redirectTo({
        url: '/pages/order/order?status=1',
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (this.options.status == 0) {
      this.setData({
        toorder: false
      })
    } else {
      this.setData({
        toorder: true
      })
    }
    console.log(this.options.goodsid)
    wx.request({
      url: 'https://malltest.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=-1&r=api/default/push-goods&',
      data: {
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9,
        goods_id: this.options.goodsid
        // goods_id: 165
      },
      success: res => {
        console.log(res.data.catId);
        this.setData({
          goods_list: res.data.data,
          cart_id: res.data.catId
        })
      }
    })
  },
  /********去上级目录***********/
  toclass() {
    wx.redirectTo({
      url: '/pages/list/list?cat_id=' + this.data.cart_id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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