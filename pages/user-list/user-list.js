var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');
const app = getApp()
Page({
    data: {
        users: [],
        type:0    // 0-任务选择页面进入列表  1-家长进入  2-成员进入
    },

    goUserDetail: function(e) {
        let id = e.currentTarget.dataset.userid;
        let select = 0;
        let canDeleted = 0;
        if(this.data.type == 0){
            select = 1;
        }else if(this.data.type == 1){
            canDeleted = 1;
        }
        wx.navigateTo({
            url: '/pages/user-detail/user-detail?select='+select+'&canDeleted='+canDeleted+'&id=' + id,
        })
    },

    getUsers() {
        let res = util.loginNow();
        if(res){
            let that = this;
            util.request(api.GetUsers).then(function(res) {
                if (res.code === 200) {
                    that.setData({
                        users: res.data.userList
                    })
                }
            });
        }
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