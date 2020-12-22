var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();
Page({
    data: {
        status: 0   // 1-发布指派任务成功  2-邀请成功  3-发布定时任务成功  4.领取额外任务成功
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            status: options.status
        })
    },

    toIndexPage: function(event) {
        wx.switchTab({
            url: '/pages/ucenter/index/index',
        });
    },

    toMyHomePage: function(event) {
        wx.switchTab({
            url: '/pages/index/index',
        });
    },

    toUserList: function(e) {
        let type = e.currentTarget.dataset.type;
        wx.reLaunch({
            url: '/pages/user-list/user-list?type='+type
        });
    },

    toInvitePage: function() {
        wx.reLaunch({
            url: '/pages/invite/invite'
        });
    },

    toReceiveJobUserPage:function(e){
        wx.reLaunch({
            url: '/pages/create-job/create-job?isCreate='+2+'&userRole='+0
        });
    }

})