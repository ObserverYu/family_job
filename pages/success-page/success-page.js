var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();
Page({
    data: {
        status: 0,
        orderId: 0,
        is_over:0,
        productId:0,
        imageUrl:''
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

    toUserList: function() {
        wx.reLaunch({
            url: '/pages/user-list/user-list?type=0'
        });
    },

    toInvitePage: function() {
        wx.reLaunch({
            url: '/pages/invite/invite'
        });
    },

})