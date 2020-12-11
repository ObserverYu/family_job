var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
    data: {
        inviteCode:''
    },
    // 复制
    copyTBL: function (e) {
        var self = this;
        wx.setClipboardData({
        data: self.data.inviteCode,
        success: function (res) {
            // self.setData({copyTip:true}),
        }
        });
    },


    getSettingsDetail() {
        let res = util.loginNow();
        if(res){
            let userInfo = wx.getStorageSync('userInfo')
            this.setData({
                inviteCode:userInfo.inviteCode
            })
        }
    },

    onLoad: function(options) {
        this.getSettingsDetail();
    },
})