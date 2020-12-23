var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var template = require('../../../config/template.js');
const user = require('../../../services/user.js');
var app = getApp();
Page({
    data: {
        inviteCode:''
        ,points:0
        ,createTime:''
        ,watchdogAvatar:''
        ,watchdogName:''
        ,canSend:0
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
                ,points:userInfo.points
                ,createTime:userInfo.createTime
                ,watchdogAvatar:userInfo.watchdogAvatar
                ,watchdogName:userInfo.watchdogName
                ,canSend:userInfo.canSend
            })
        }
    },

    onLoad: function(options) {
        this.getSettingsDetail();
    },

    switchChange(e) {
        let status = e.detail.value;
        if(!status){
            wx.showModal({
                title: '确认关闭通知?',
                content: '关闭后将不会再收到定时任务通知提醒',
                success (res) {
                  if (res.confirm) {
                    user.updateSendMsg(2);
                    wx.showToast({
                        title: '关闭成功',
                        icon: 'success',
                        duration: 1000
                    })
                  } 
                }
            })
            return;
        }
        let that = this;
        let templateId =template.RENWUTIXING;
        wx.showModal({
            title: '说明',
            content: '即将拉起授权\r\n 1.选择不再询问并允许,则会持续进行任务通知.\r\n 2.未选择不再询问并允许,只会通知一次,下次通知还需要授权. \r\n 3.选择拒绝则不会再发送通知',
            showCancel:false,
            success: function (res) {
                if (res.confirm) {  
                    wx.requestSubscribeMessage({
                        tmplIds: [templateId],
                        success (res) {
                            console.info("拉起鉴权询问成功")
                            let userClick = res[templateId];
                            if(userClick == 'accept'){
                                console.info("用户接受")
                                that.setData({
                                    canSend : 1
                                })
                                user.updateSendMsg(1)
                                wx.showToast({
                                    title: '授权成功',
                                    icon: 'success',
                                    duration: 1000
                                })
                            }else if(userClick == 'ban' || userClick == 'reject'){
                                console.info("用户拒绝")
                                that.setData({
                                    canSend : 2
                                })
                                user.updateSendMsg(2)
                                wx.showToast({
                                    title: '用户拒绝或消息关闭',
                                    icon: 'fail',
                                    duration: 1000
                                })
                            }
                        }
                        ,fail(res){
                            console.info("询问失败:"+res.errMsg)
                        }
                    })
                }
            }
        })

    },
})