var a, n, e;

getApp();

Page({
    data: {},
    onLoad: function(t) {
        var o = new Date(), c = o.getFullYear(), g = o.getMonth() + 1;
        n = o.getDate(), console.log("date" + n);
        var r = o.getDay();
        console.log(r);
        var l = 7 - (n - r) % 7;
        console.log("nbsp" + l);
        var i;
        1 == g || 3 == g || 5 == g || 7 == g || 8 == g || 10 == g || 12 == g ? i = 31 : 4 == g || 6 == g || 9 == g || 11 == g ? i = 30 : 2 == g && (i = (c - 2e3) % 4 == 0 ? 29 : 28), 
        null != wx.getStorageSync("calendarSignData") && "" != wx.getStorageSync("calendarSignData") || wx.setStorageSync("calendarSignData", new Array(i)), 
        null != wx.getStorageSync("calendarSignDay") && "" != wx.getStorageSync("calendarSignDay") || wx.setStorageSync("calendarSignDay", 0), 
        a = wx.getStorageSync("calendarSignData"), e = wx.getStorageSync("calendarSignDay"), 
        console.log(a), console.log(e), this.setData({
            year: c,
            month: g,
            nbsp: l,
            monthDaySize: i,
            date: n,
            calendarSignData: a,
            calendarSignDay: e
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    register_rule: function() {
        this.setData({
            register_rule: !0
        });
    },
    hideModal: function() {
        this.setData({
            register_rule: !1
        });
    },
    calendarSign: function() {
        a[n] = n, console.log(a), e += 1, wx.setStorageSync("calendarSignData", a), wx.setStorageSync("calendarSignDay", e), 
        wx.showToast({
            title: "签到成功",
            icon: "success",
            duration: 2e3
        }), this.setData({
            calendarSignData: a,
            calendarSignDay: e
        });
    }
});