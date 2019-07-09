// pages/integral-ify/conversion.js
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var name = this.options.name
    var id = this.options.id;
    var that = this;
    console.log(wx.getStorageSync("access_token"));
    wx.setNavigationBarTitle({
      title: name,
    });
    wx.request({
      url: 'https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/integralmall/integralmall/integral-cat-mch',
      method: 'get',
      data: {
        catId: id,
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            store_list: res.data.data.mchCatList
          })
        } else {
          console.log(res.data.msg)
        }
      }
    })
  },
/********去店铺详情******/
  todetail(evnet){
    var id = evnet.currentTarget.dataset.id;
    var index = evnet.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/integral-ify-detail/ify-detail?id='+id+'&name='+this.data.store_list[index].name,
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