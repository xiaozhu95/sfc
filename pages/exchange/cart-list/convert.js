// pages/exchange/cart-list/convert.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 1
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
    var id = this.options.coupon_id;
    var store_id = this.options.store_id;
    wx.getSystemInfoSync('user_info');
    console.log(wx.getStorageSync("user_info"))
    this.setData({
      user_name: wx.getStorageSync("user_info").nickname
    });
    var that = this;
    console.log(id);
    wx.request({
      url: 'https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/integralmall/integralmall/integral-goods-detail',
      method: 'get',
      data: {
        goods_id: id,
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9
      },
      success: function(res) {
        console.log(id)
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            coupon_detail: res.data.data.integralGoodsDetail[0]
          })
          if (that.data.coupon_detail.goods_num == 0) {
            that.setData({
              num: 0
            })
          }
        } else {
          console.log(res.data.msg)
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function() {
              wx.navigateBack({
                delta: 1
              })
            },
            fail: function() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
    })
  },
  reduce() {
    if (this.data.num > 1) {
      var newnum = this.data.num - 1
      this.setData({
        num: newnum
      })
    }
  },
  add() {
    if (this.data.num < this.data.coupon_detail.goods_num) {
      this.setData({
        num: this.data.num + 1
      })
    }

  },
  /*提交*/
  ordersumbit() {
    var goods_id = this.options.coupon_id;;
    var goods_num = this.data.num;
    var store_id = this.options.store_id;
    if (goods_num == 0) {
      return (
        wx.showToast({
          icon: 'none',
          title: '已经告罄',
        })
      )
    }
    wx.request({
      url: 'https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/integralmall/integralmall/exchange-card',
      data: {
        goods_id: goods_id,
        goods_num: goods_num,
        mch_id: store_id,
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9
      },
      method: 'get',
      success: function(res) {
        console.log(res);
        if (res.data.code == 0) {
          wx.redirectTo({
            url: '/pages/card/card',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
        }
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