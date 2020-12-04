var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        users: [],
        type:0
    },
    goUserDetail: function(e) {
        let id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: '/pages/user-detail/user-detail?select=1&canDeleted=0&id=' + id,
        })
    },
    getUsers() {
        util.loginNow();
        let that = this;
        util.request(api.GetUsers).then(function(res) {
            if (res.code === 200) {
                that.setData({
                    users: res.data.userList
                })
            }
        });
    },
    selectUser:function(e) {
        let userId = e.currentTarget.dataset.userId
        wx.setStorageSync('addressId', addressId);
        wx.navigateBack();
    },
    onLoad: function(options) {
        let type = options.type;
        this.setData({
            type: type
        })
    },
    onUnload: function() {},
    onShow: function() {
        this.getUsers();
    },
    addAddress: function() {
        wx.navigateTo({
            url: '/pages/ucenter/address-detail/index?id=' + 0,
        })
    },
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        this.getAddresses();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    }
})