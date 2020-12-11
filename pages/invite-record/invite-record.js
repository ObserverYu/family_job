var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        inviteRecord:{}
    },
    
    onLoad: function(options) {
        let that = this;
        // 创建任务页面
        const eventChannel = this.getOpenerEventChannel()
        // 监听事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('inviteRecordEven', function(inviteRecord) {
            that.setData({
                inviteRecord:inviteRecord
            })
        })
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

    accept() {
        wx.showLoading({
            title: '提交中',
            mask:true
        })
        util.request(api.AcceptInvite, {
            inviteRecordId:this.data.inviteRecord.id
        },'POST').then(function(res) {
            wx.hideLoading()
            if (res.code === 200) {
                wx.showToast({
                    title: "操作成功",
                    icon: 'none',
                    duration: 500,
                    mask:true
                })
                setTimeout(()=>{
                    wx.reLaunch({
                        url: '/pages/index/index',
                    });
                },500)
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },

    refuse() {
        wx.showLoading({
            title: '提交中',
            mask:true
        })
        util.request(api.RefuseInvite, {
            inviteRecordId:this.data.inviteRecord.id
        },'POST').then(function(res) {
            wx.hideLoading()
            if (res.code === 200) {
                wx.showToast({
                    title: "操作成功",
                    icon: 'none',
                    duration: 500,
                    mask:true
                })
                setTimeout(()=>{
                    wx.reLaunch({
                        url: '/pages/index/index',
                    });
                },500)
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },
})