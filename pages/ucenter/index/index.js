var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');

// TODO 订单显示数量在图标上

const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        status: {},
    },
    onLoad: function(options) {
    },
    onShow: function() {
        let userInfo = wx.getStorageSync('userInfo');
        if(userInfo == ''){
            this.setData({
                hasUserInfo: 0,
            });
        }
        else{
            this.setData({
                hasUserInfo: 1,
            });
        }
        this.setData({
            userInfo: userInfo,
        });
        this.getJobInfo();
        wx.removeStorageSync('categoryId');
    },

    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.getOrderInfo();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    getJobInfo: function(e) {
        let that = this;
        util.request(api.JobCountInfo).then(function(res) {
            if (res.code === 200) {
                let status = res.data;
                that.setData({
                    status: status
                });
            }
        });
    },

    goProfile: function (e) {
        let res = util.loginNow();
        if (res == true) {
            wx.navigateTo({
                url: '/pages/ucenter/settings/index',
            });
        }
    },
    toJobListTap: function(event) {
        let res = util.loginNow();
        if (res == true) {
            let isminejob = event.currentTarget.dataset.isminejob;
            let state = event.currentTarget.dataset.state;
            console.info(event.currentTarget.dataset)
            wx.navigateTo({
                url: '/pages/ucenter/job-list/job-list?isMineJob=' + isminejob + '&state=' + state + '&doRefresh=1',
            });
        }
    },
    toAddressList: function(e) {
        let res = util.loginNow();
        if (res == true) {
            wx.navigateTo({
                url: '/pages/ucenter/address/index?type=0',
            });
        }
    },
    toAbout: function () {
        wx.navigateTo({
            url: '/pages/ucenter/about/index',
        });
    },
    toUserList: function(e) {
        let res = util.loginNow();
        if (res == true) {
            wx.navigateTo({
                url: '/pages/user-list/user-list?type=0',
            });
        }
    },
    goAuth: function(e) {
        wx.navigateTo({
            url: '/pages/app-auth/index',
        });
    }
})