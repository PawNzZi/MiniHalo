// pages/admin/friendLink/friendLink.js 
const Api = require('../../../utils/api');
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showShare: false,
    options: [{
        name: '新增友链',
        icon: 'http://cdn.lingyikz.cn/add.png',
      }, 
      {
        name: '更新友链',
        icon: 'http://cdn.lingyikz.cn/update.png',
      },
      {
        name: '删除友链',
        icon: 'http://cdn.lingyikz.cn/delete.png',
      },
    ],
  },
  clickItem: function (e) {
    this.setData({
      showShare: true,
      item: e.detail.item
    })
    // console.log(e.detail.item);
  },
  onClose: function () {
    this.setData({
      showShare: false
    });
  },
  onSelect: function (e) {
    console.log(e);
    var _this = this;
    var index = e.detail.index;
    var item = this.data.item;
    var linkId = item.id
    if (index == 0 || index == 1) {
      _this.setData({
        showShare: false
      })
      wx.navigateTo({
        url: '/pages/admin/friendLink/friendLinkDetail/friendLinkkDetail?index=' + index + '&linkId=' + linkId,
      })
    } else {
      App.showModal('确定删除 ' + item.name + ' 友链？', {
        success() {
          // console.log("删除tag")
          var data = {};
          Api.requestDeleteApi('/api/admin/links/' + linkId, data, _this, _this.deleteLinkSuccess);
        }
      })
    }
  },
  deleteLinkSuccess: function (res, obj) {
    obj.setData({
      showShare: false
    })
    App.showSinglModalFun('删除成功', {
      success() {
        var data = {};
        data.sort = 'createTime,desc';
        Api.requestGetApi('/api/admin/links', data, this, this.linkSuccess);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },
  linkSuccess: function (res, obj) {
    var array = res.data;
    for (var i = 0; i < array.length; i++) {
      array[i].color = App.radomColor();
    }
    obj.setData({
      colorList: array
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var data = {};
    data.sort = 'createTime,desc';
    Api.requestGetApi('/api/admin/links', data, this, this.linkSuccess);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})