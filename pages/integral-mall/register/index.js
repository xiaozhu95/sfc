var t = require("../../../api.js"), e = getApp();

Page({
    data: {
        currentDate: "",
        dayList: "",
        currentDayList: "",
        currentObj: "",
        currentDay: "",
        selectCSS: "bk-color-day",
        weeks: [ {
            day: "日"
        }, {
            day: "一"
        }, {
            day: "二"
        }, {
            day: "三"
        }, {
            day: "四"
        }, {
            day: "五"
        }, {
            day: "六"
        } ]
    },
    doDay: function(t) {
        var e = this, a = e.data.currentObj, r = a.getFullYear(), n = a.getMonth() + 1, i = a.getDate(), s = "";
        s = "left" == t.currentTarget.dataset.key ? (n -= 1) <= 0 ? r - 1 + "/12/" + i : r + "/" + n + "/" + i : (n += 1) <= 12 ? r + "/" + n + "/" + i : r + 1 + "/1/" + i, 
        a = new Date(s), this.setData({
            currentDate: a.getFullYear() + "年" + (a.getMonth() + 1) + "月",
            currentObj: a,
            currentYear: a.getFullYear(),
            currentMonth: a.getMonth() + 1
        });
        var o = a.getFullYear() + "/" + (a.getMonth() + 1) + "/";
        this.setSchedule(a);
        var u = wx.getStorageSync("currentDayList");
        for (var g in u) console.log();
        var c = [], d = e.data.registerTime;
        for (var g in u) c.push(o + u[g]);
        var l = function(t, e) {
            for (var a = 0, r = 0, n = new Array(); a < t.length && r < e.length; ) t[a] < e[r] ? a++ : t[a] > e[r] ? r++ : (n.push(t[a]), 
            a++, r++);
            return n;
        }(c, d), h = [];
        for (var g in u) u[g] && (u[g] = {
            date: u[g],
            is_re: 0
        });
        for (var g in l) {
            h = l[g].split("/"), console.log(h[2]);
            for (var g in u) u[g].date == h[2] && (u[g].is_re = 1);
        }
        e.setData({
            currentDayList: u
        });
    },
    setSchedule: function(t) {
        for (var e = t.getMonth() + 1, a = t.getFullYear(), r = t.getDate(), n = (t.getDate(), 
        new Date(a, e, 0).getDate()), i = t.getUTCDay() + 1 - (r % 7 - 1), s = i <= 0 ? 7 + i : i, o = [], u = 0, g = 0; g < 42; g++) {
            g < s ? o[g] = "" : u < n ? (o[g] = u + 1, u = o[g]) : u >= n && (o[g] = "");
        }
        wx.setStorageSync("currentDayList", o);
    },
    selectDay: function(t) {
        var e = this;
        e.setData({
            currentDay: t.target.dataset.day,
            currentDa: t.target.dataset.day,
            currentDate: e.data.currentYear + "年" + e.data.currentMonth + "月",
            checkDay: e.data.currentYear + "" + e.data.currentMonth + t.target.dataset.day
        });
    },
    onLoad: function(t) {
        getApp().pageOnLoad(this);
        var e = this.getCurrentDayString();
        this.setData({
            currentDate: e.getFullYear() + "年" + (e.getMonth() + 1) + "月",
            today: e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate(),
            yearmonth: e.getFullYear() + "/" + (e.getMonth() + 1) + "/",
            today_time: e.getFullYear() + "" + (e.getMonth() + 1) + e.getDate(),
            currentDay: e.getDate(),
            currentObj: e,
            currentYear: e.getFullYear(),
            currentMonth: e.getMonth() + 1
        }), this.setSchedule(e);
    },
    getCurrentDayString: function() {
        var t = this.data.currentObj;
        if ("" != t) return t;
        var e = new Date(), a = e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate();
        return new Date(a);
    },
    onReady: function() {},
    onShow: function() {
        getApp().pageOnShow(this);
        var a = this;
        e.request({
            url: t.integral.explain,
            data: {
                today: a.data.today
            },
            success: function(t) {
                if (0 == t.code) {
                    if (t.data.register) e = t.data.register.continuation; else var e = 0;
                    a.setData({
                        register: t.data.setting,
                        continuation: e,
                        registerTime: t.data.registerTime
                    }), console.log(t.data.setting), t.data.today && a.setData({
                        status: 1
                    });
                    var r = wx.getStorageSync("currentDayList"), n = [];
                    for (var i in r) n.push(a.data.yearmonth + r[i]);
                    var s = function(t, e) {
                        for (var a = 0, r = 0, n = new Array(); a < t.length && r < e.length; ) t[a] < e[r] ? a++ : t[a] > e[r] ? r++ : (n.push(t[a]), 
                        a++, r++);
                        return n;
                    }(n, t.data.registerTime), o = [];
                    for (var i in r) r[i] && (r[i] = {
                        date: r[i],
                        is_re: 0
                    });
                    console.log(r);
                    for (var i in s) {
                        o = s[i].split("/");
                        for (var i in r) r[i].date == o[2] && (r[i].is_re = 1);
                    }
                    a.setData({
                        currentDayList: r
                    });
                }
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    register_rule: function() {
        this.setData({
            register_rule: !0,
            status_show: 2
        });
    },
    hideModal: function() {
        this.setData({
            register_rule: !1
        });
    },
    calendarSign: function() {
        var a = this, r = a.data.today_time, n = a.data.today, i = a.data.currentDay, s = a.data.checkDay;
        if (s && parseInt(r) != parseInt(s)) wx.showToast({
            title: "日期不对哦",
            image: "/images/icon-warning.png"
        }); else {
            var o = a.data.currentDayList;
            e.request({
                url: t.integral.register,
                data: {
                    today: n
                },
                success: function(t) {
                    if (0 == t.code) {
                        a.data.registerTime.push(n);
                        var e = t.data.continuation;
                        for (var r in o) o[r].date == i && (o[r].is_re = 1);
                        a.setData({
                            register_rule: !0,
                            status_show: 1,
                            continuation: e,
                            status: 1,
                            currentDayList: o,
                            registerTime: a.data.registerTime
                        }), parseInt(e) >= parseInt(a.data.register.register_continuation) && a.setData({
                            jiangli: 1
                        });
                    } else wx.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
        }
    }
});