var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        inviteCode:'',
    },

    bindinputInviteCode(event) {
        this.setData({
            inviteCode: event.detail.value
        });
    },
    
    onLoad: function(options) {
        util.loginNow();
    },

    onReady: function() {
    },

    onShow: function() {

    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭

    },

    inviteUser() {
        let login = util.loginNow();
        if(login){
            let inviteCode = this.data.inviteCode;
            if(inviteCode == null || inviteCode == ''){
                util.showErrorToast('邀请码不能为空');
                return false;
            }
            wx.showLoading({
                title: '提交中',
                mask:true
            })
            util.request(api.InviteUser,{
                inviteCode:inviteCode
            }, 'POST')
            .then(function(res) {
                wx.hideLoading()
                if (res.code === 200) {
                    wx.reLaunch({
                      url: '../success-page/success-page?status=2',
                    })
                }else{
                    wx.showToast({
                        title: res.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            });
        }
    },
})