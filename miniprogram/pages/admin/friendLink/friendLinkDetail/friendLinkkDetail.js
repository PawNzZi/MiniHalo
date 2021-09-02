// pages/admin/friendLink/friendLinkDetail/friendLinkkDetail.js
const Api = require('../../../../utils/api')
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn_text: '',
    name: '',
    url: '',
  },
  getInputName: function (e) {
    this.setData({
      name: e.detail
    });
  },
  getInputUrl: function (e) {
    this.setData({
      url: e.detail
    });
  },
  getInputLogo: function (e) {
    this.setData({
      logo: e.detail
    });
  },
  getInputTeam: function (e) {
    this.setData({
      team: e.detail
    });
  },
  getInputPrioity: function (e) {
    this.setData({
      priority: e.detail
    });
  },
  getInputDescription: function (e) {
    this.setData({
      description: e.detail
    });
  },
  /**
   * 新增标签或修改标签提交Api
   */
  commitApi: function () {
    var name = this.data.name;
    var url = this.data.url;

    if (App.checkTextIsEmpty(name) && App.checkTextIsEmpty(url)) {
      var index = this.data.index;
      var linkId = this.data.linkId;
      var data = {};
      data.name = name;
      data.url = url;
      data.logo = this.data.logo;
      data.team = this.data.team;
      data.priority = this.data.priority;
      data.description = this.data.description;
      if (index == 0) {
        Api.requestPostJSONApi('/api/admin/links', data, this, this.linkSuccess);
      } else {
        Api.requestPutJSONApi('/api/admin/links/' + linkId, data, this, this.linkSuccess);
      }
    } else {
      App.showToast("名称或URL不能为空")
    }

  },
  /**
   * 新增或修改成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  linkSuccess: function (res, obj) {
    App.showSinglModalFun('操作成功！', {
      success() {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = options.index;
    if (index == 0) {
      wx.setNavigationBarTitle({
        title: '新建Link',
      })
      this.setData({
        btn_text: '保存',
        index: index
      })
    } else {
      wx.setNavigationBarTitle({
        title: '修改Link',
      })
      var linkId = options.linkId;
      this.setData({
        btn_text: '更新',
        linkId: linkId,
        index: index
      })
      var data = {};
      Api.requestGetApi('/api/admin/links/' + linkId, data, this, this.getLinkDetailSuccess);
    }
  },
  getLinkDetailSuccess: function (res, obj) {
    obj.setData({
      name: res.data.name,
      url: res.data.url,
      logo: res.data.logo,
      team: res.data.team,
      priority: res.data.priority,
      description: res.data.description
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