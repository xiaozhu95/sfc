var a = {
  page: null,
  data: null,
  old_value: [0, 0, 0],
  result: [null, null, null],
  init: function(a) {
    var t = this;
    t.page = a.page, t.data = a.data, t.page.showAreaPicker = function() {
      t.page.setData({
        area_picker_show: !0
      });
    }, t.page.hideAreaPicker = function() {
      t.page.setData({
        area_picker_show: !1
      });
    };
    var e = t.data[0].list || [],
      i = [];
    return e.length > 0 && (i = e[0].list || []), t.page.setData({
      area_picker_province_list: t.data,
      area_picker_city_list: e,
      area_picker_district_list: i
    }), t.result[0] = t.data[0] || null, t.data[0].list && (t.result[1] = t.data[0].list[0],
      t.data[0].list[0].list && (t.result[2] = t.data[0].list[0].list[0])), t.page.areaPickerChange = function(a) {
      var l = a.detail.value[0],
        r = a.detail.value[1],
        s = a.detail.value[2];
      a.detail.value[0] != t.old_value[0] && (r = 0, s = 0, e = t.data[l].list, i = e[0].list,
          t.page.setData({
            area_picker_city_list: [],
            area_picker_district_list: []
          }), setTimeout(function() {
            t.page.setData({
              area_picker_city_list: e,
              area_picker_district_list: i
            });
          }, 0)), a.detail.value[1] != t.old_value[1] && (s = 0, i = t.data[l].list[r].list,
          t.page.setData({
            area_picker_district_list: []
          }), setTimeout(function() {
            t.page.setData({
              area_picker_district_list: i
            });
          }, 0)), a.detail.value[2], t.old_value[2], t.old_value = [l, r, s], t.result[0] = t.data[l],
        t.result[1] = t.data[l].list[r], t.result[2] = t.data[l].list[r].list[s];
    }, t.page.areaPickerConfirm = function() {
      t.page.hideAreaPicker(), t.page.onAreaPickerConfirm && t.page.onAreaPickerConfirm(t.result);
    }, this;
  }
};

module.exports = a;