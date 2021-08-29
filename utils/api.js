/**
 * @desc    API请求接口类封装
 * @author  Roy
 * @date    2019年7月29日17:38:06
 */
const https = 'https://13archives.lingyikz.cn' //体验版域名

const App = getApp();
/**
 * POST请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestPostApi(url, params, sourceObj, successFun) {
    requestApi(url, params, 'POST', "", sourceObj, successFun)
}
/**
 * POST请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestPostJSONApi(url, params, sourceObj, successFun) {
    requestApi(url, params, 'POST', "JSON", sourceObj, successFun)
}

/**
 * GET请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestGetApi(url, params, sourceObj, successFun) {
    requestApi(url, params, 'GET', "", sourceObj, successFun)
}

/**
 * 请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {String}   method      请求类型
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestApi(url, params, method, type, sourceObj, successFun) {
    App.showLoading("Loading")
    var AUTHORIZATIONS = App.globalData.AUTHORIZATIONS;
    var adminAuthorization;
    var admin = wx.getStorageSync('admin');
    if (admin) {
        adminAuthorization = admin.access_token;
    } else {
        adminAuthorization = '';
    }
    // console.log("AUTHORIZATIONS:" + AUTHORIZATIONS);
    var contentType;
    if (method == 'POST') {
        if (type == "JSON") {
            contentType = 'application/json';

        } else {
            contentType = 'application/x-www-form-urlencoded'
        }
    } else {
        contentType = 'application/x-www-form-urlencoded'
    }
    wx.request({
        url: https + url,
        method: method,
        data: params,
        header: {
            'Content-Type': contentType,
            'API-Authorization': AUTHORIZATIONS,
            'admin-authorization': adminAuthorization
        },
        success: function (res) {
            // console.log("s");
            // console.log(res)
            if (res.data.status == 200) {
                typeof successFun == 'function' && successFun(res.data, sourceObj);
            } else {
                App.showToast(res.data.message);
            }

        },
        fail: function (res) {
            App.showToast("网络错误")
            // typeof failFun == 'function' && failFun(res.data, sourceObj)
        },
        complete: function (res) {
            App.hideLoading();
            // typeof completeFun == 'function' && completeFun(res.data, sourceObj)
        }
    })
}
module.exports = {
    requestPostApi,
    requestGetApi,
    requestPostJSONApi,
}