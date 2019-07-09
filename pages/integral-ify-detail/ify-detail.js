// pages/integral-ify-detail/ify-detail.js
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
    // }]
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 80,
    word: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapCtx = wx.createMapContext('myMap');
    console.log(this.data.markers);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var id = this.options.id;
    wx.setNavigationBarTitle({
      title: this.options.name
    })
    var that = this;
    // console.log(this.data.markers)
    wx.request({
      url: 'https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/integralmall/integralmall/integral-card-list',
      method: 'get',
      data: {
        mchId: id,
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 0) {
          var markers = [{
            id: 1,
            latitude: res.data.data.mchList.latitude,
            longitude: res.data.data.mchList.longitude,
            name: res.data.data.mchList.name
          }]
          that.setData({
            cart_list: res.data.data.integralGoodsList,
            store_detail: res.data.data.mchList,
            markers: markers
          })
          console.log(that.data.markers);
        } else {
          console.log(res.data.msg)
        }
      }
    })
  },
  // 
  convert(event) {
    var id = event.currentTarget.dataset.id;
    var store_id = this.data.store_detail.id;
    console.log(id)
    // wx.navigateTo({
    //   url: '/pages/integral-mall/coupon-info/index?coupon_id=' + id,
    // })
    wx.navigateTo({
      url: '/pages/exchange/cart-list/convert?coupon_id=' + id + '&store_id=' + store_id,
    })
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