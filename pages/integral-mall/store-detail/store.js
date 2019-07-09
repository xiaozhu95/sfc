// pages/integral-mall/store-detail/store.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    word: false
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var query = wx.createSelectorQuery();
    query.select('#gain').boundingClientRect();
    query.exec(function(res) {
      console.log(res);
      console.log(res[0].height);
    })
    console.log(this)
    var id = this.options.id;
    var that = this;
    wx.request({
      url: 'https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/integralmall/integralmall/integral-mch-goods',
      method: 'get',
      data: {
        mchId: id,
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9
      },
      success: function(res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            goods: res.data.data.integralGoodsList,
            store: res.data.data.integralMchList[0],
            user_integral: res.data.data.userInformation[0].integral
          })
        } else {
          console.log(res.data.msg);
        }
      }
    })
  },
  tochange(event) {
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    var integral = this.data.user_integral;
    wx.navigateTo({
      url: '/pages/integral-mall/goods-info/index?goods_id=' + id + '&integral=' + integral,
    })
  },
  check_word() {
    this.setData({
      word: !this.data.word
    });
    var query = wx.createSelectorQuery();
    query.select('#gain').boundingClientRect();
    query.exec(function(res) {
      console.log(res);
      console.log(res[0].height);
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