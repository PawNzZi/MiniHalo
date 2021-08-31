// pages/admin/attachment/attachment.js
const Api = require('../../../utils/api');
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attachmentList: [],
    showShare: false,
    options: [{
        name: '上传图片',
        icon: 'http://cdn.lingyikz.cn/add.png',
      },
      {
        name: '复制图片',
        icon: 'http://cdn.lingyikz.cn/copy.png',
      },
      {
        name: '删除图片',
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
  /**
   * 底部sheet选项
   * @param {*} e 
   */
  onSelect: function (e) {
    var _this = this;
    var index = e.detail.index;
    var item = this.data.item;
    var fileId = item.id
    if (index == 0) {
      _this.setData({
        showShare: false
      })
      App.uploadThumb({
        success(res) {
          // console.log(res);
          App.showToast("上传成功");
          setTimeout(function () {
            var attachmentList = _this.data.attachmentList;
            attachmentList.length = 0;
            _this.setData({
              attachmentList: attachmentList
            });
            _this.attachmentList(0)
          }, 1000);

        }
      })
    } else if (index == 1) {
      //复制图片地址
      wx.setClipboardData({
        data: item.thumbPath,
        success(res) {
          wx.getClipboardData({
            success(res) {

            }
          })
        }
      })
    } else if (index == 2) {
      App.showModal('确定删除附件 ' + item.name + ' ？', {
        success() {
          // console.log("删除tag")
          _this.setData({showShare: false});
          var data = {};
          Api.requestDeleteApi('/api/admin/attachments/' + fileId, data, _this, _this.deleteAttachmentSuccess);
        }
      })
    }
  },
  /**
   * 删除附件成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  deleteAttachmentSuccess: function (res, obj) {
    App.showToast("删除成功");
    setTimeout(function () {
      var attachmentList = obj.data.attachmentList;
      attachmentList.length = 0;
      obj.setData({
        attachmentList: attachmentList,
      });
      obj.attachmentList(0)
    }, 1000);
    // obj.attachmentList(0)
  },
  /**
   * 获取附件Api
   * @param {*} page 
   */
  attachmentList: function (page) {
    var data = {};
    data.page = page;
    data.size = 15;
    data.sort = 'createTime,desc';
    Api.requestGetApi('/api/admin/attachments', data, this, this.attachmentSuccess);
  },
  /**
   * 获取附件成功回调
   * @param {*} res 
   * @param {*} obj 
   */
  attachmentSuccess: function (res, obj) {
    var array = res.data.content;
    var attachmentList = obj.data.attachmentList;
    attachmentList = attachmentList.concat(array);
    obj.setData({
      attachmentList: attachmentList,
      hasNext: res.data.hasNext,
      page: res.data.page
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.attachmentList(0);
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
    var hasNext = this.data.hasNext;
    if (hasNext) {
      var page = this.data.page;
      this.attachmentList(page + 1);
    } else {
      App.showToast("别拉了，拉完了")
    }
  },
})