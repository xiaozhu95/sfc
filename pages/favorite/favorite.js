var a = require("../../api.js"),
  o = getApp();

Page({
  data: {
    swiper_current: 0,
    goods: {
      list: null,
      is_more: !0,
      is_loading: !1,
      page: 1
    },
    topic: {
      list: null,
      is_more: !0,
      is_loading: !1,
      page: 1
    },
    btn: false,
    /*删除按钮*/
    reveal: true,
    /*删除show*/
    elect: false,
    /*全选*/
  },
  onLoad: function(a) {
    o.pageOnLoad(this), this.loadGoodsList({
      reload: !0,
      page: 1
    }), this.loadTopicList({
      reload: !0,
      page: 1
    });
  },
  elect: function(event) {
    var k = event.currentTarget.dataset.index;
    this.data.goods.list[k].checked = !this.data.goods.list[k].checked;
    console.log(this.data.goods.list[k]);
    this.setData({
      goods: this.data.goods
    });
    console.log(this.data.goods);
    var aaa = this.data.goods.list;
    var bbb = aaa.filter(function(item) {
      return item.checked == true;
    });
    if (bbb.length == aaa.length) {
      this.setData({
        elect: true
      })
    } else {
      this.setData({
        elect: false
      })
    }
  },
  allelect() {
    this.setData({
      elect: !this.data.elect
    })
    console.log(this.data.elect)
    if (this.data.elect == true) {
      for (let j in this.data.goods.list) {
        this.data.goods.list[j].checked = true;
      }
    } else {
      for (let j in this.data.goods.list) {
        this.data.goods.list[j].checked = false;
      }
    }
    this.setData({
      goods: this.data.goods
    })
    console.log(this.data.goods)
  },
  isBtn() {
    this.setData({
      btn: !this.data.btn,
      reveal: !this.data.reveal
    })
  },
  collection() {
    var goodsList = []
    var aaa = this.data.goods.list
    console.log(aaa)
    var bbb = aaa.filter(function(item) {
      return item.checked == true;
    });
    for (let j in bbb) {
      goodsList.push(bbb[j].goods_id)
    }
    console.log(goodsList)
    console.log(bbb)
    var that = this;
    o.request({
      url: "https://mall.yigshop.com/addons/yigou_mall/core/web/debug.php?store_id=1&r=api/user/favorites-remove",
      method: "post",
      data: {
        goods_id: goodsList
      },
      success: function(t) {
        that.setData({
          btn: false,
          reveal: !that.data.reveal
        });
        that.loadGoodsList({
          reload: !0,
          page: 1
        })
      }
    });
  },
  tabSwitch: function(a) {
    var o = this,
      t = a.currentTarget.dataset.index;
    o.setData({
      swiper_current: t
    });
  },
  swiperChange: function(a) {
    console.log(a), this.setData({
      swiper_current: a.detail.current
    });
  },
  loadGoodsList: function(t) {
    var i = this;
    i.data.goods.is_loading || t.loadmore && !i.data.goods.is_more || (i.data.goods.is_loading = !0,
      i.setData({
        goods: i.data.goods
      }), o.request({
        url: a.user.favorite_list,
        data: {
          page: t.page
        },
        success: function(a) {
          0 == a.code && (t.reload && (i.data.goods.list = a.data.list), t.loadmore && (i.data.goods.list = i.data.goods.list.concat(a.data.list)),
            i.data.goods.page = t.page, i.data.goods.is_more = a.data.list.length > 0, i.setData({
              goods: i.data.goods
            }));
          for (var j in i.data.goods.list) {
            i.data.goods.list[j].checked = false;
          }
          i.setData({
            goods: i.data.goods,
            elect: false
          })
          console.log(i.data.goods.list);
        },
        complete: function() {
          i.data.goods.is_loading = !1, i.setData({
            goods: i.data.goods
          });
        }
      }));
  },
  goodsScrollBottom: function() {
    var a = this;
    a.loadGoodsList({
      loadmore: !0,
      page: a.data.goods.page + 1
    });
  },
  loadTopicList: function(t) {
    var i = this;
    i.data.topic.is_loading || t.loadmore && !i.data.topic.is_more || (i.data.topic.is_loading = !0,
      i.setData({
        topic: i.data.topic
      }), o.request({
        url: a.user.topic_favorite_list,
        data: {
          page: t.page
        },
        success: function(a) {
          0 == a.code && (t.reload && (i.data.topic.list = a.data.list), t.loadmore && (i.data.topic.list = i.data.topic.list.concat(a.data.list)),
            i.data.topic.page = t.page, i.data.topic.is_more = a.data.list.length > 0, i.setData({
              topic: i.data.topic
            }));
        },
        complete: function() {
          i.data.topic.is_loading = !1, i.setData({
            topic: i.data.topic
          });
        }
      }));
  },
  topicScrollBottom: function() {
    var a = this;
    a.loadTopicList({
      loadmore: !0,
      page: a.data.topic.page + 1
    });
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onReachBottom: function() {
    this.loadMoreGoodsList();
  }
});