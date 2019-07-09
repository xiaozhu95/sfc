// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codecontent: '获取验证码',
    time: 61
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

  },
  getphone(e) {
    console.log(e);
    this.setData({
      phone: e.detail.value
    })
  },
  getsmg(e) {
    this.setData({
      smg: e.detail.value
    })
  },
  getCode() {
    var that = this;
    var currentTime = that.data.time;

    wx.request({
      url: 'https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/passport/self-send-message',
      data: {
        tel_no: that.data.phone,
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9
      },
      method: 'get',
      success: function(res) {
        if (res.data.code == 0) {
          var interval = setInterval(function() {
            currentTime--;
            that.setData({
              codecontent: currentTime + '秒'
            })
            if (currentTime <= 0) {
              clearInterval(interval)
              that.setData({
                codecontent: "重新发送",
                time: 61
              })
            }
          }, 1000);
        }
        if (res.data.code == 1) {
          wx.showToast({
            icon: 'none',
            title: res.data.msg
          })
        }
        console.log(res)
      }
    })
  },
  register() {
    var that = this;
    console.log(that.data.phone)
    if (that.data.phone == undefined) {
      return wx.showToast({
        icon: 'none',
        title: '请输入手机号',
      });
    }
    wx.request({
      url: 'https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/passport/validata-self-message',
      method: 'get',
      data: {
        tel_no: that.data.phone,
        smg: that.data.smg,
        access_token: wx.getStorageSync("access_token"),
        _uniacid: 9,
        _acid: 9
      },
      success: function(res) {
        console.log(res);
        if (res.data.code.register == 1) {
          wx.showToast({
            icon: 'none',
            title: res.data.code.msg,
          });
          wx.navigateBack({
            delta: 1
          });
        }
        if (res.data.code == 1) {
          wx.showToast({
            icon: "none",
            title: res.data.msg,
            duration: 2000
          })
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
          });
          wx.navigateBack({
            delta: 1
          })
        }
        console.log(res);
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