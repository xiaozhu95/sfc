var n = require("../../../api.js"), t = getApp();

Page({
    data: {},
    onLoad: function(n) {},
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this);
        var o = this;
        t.request({
            url: n.integral.explain,
            data: {},
            success: function(n) {
                0 == n.code && (o.setData({
                    integral_shuoming: n.data.setting.integral_shuoming
                }), console.log(n.data.setting.integral_shuoming));
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});