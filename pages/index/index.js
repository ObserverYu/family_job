var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');

const app = getApp()

Page({
    data: {
        userInfo: {},
        family:{},
        hasFamily: false,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        status: {},
        inviteRecord: {},
        hasInvite:false
    },

    onLoad: function(options) {
        let res = util.loginNow();
    },

    onShow: function() {
        this.refreshHomePage();
    },

    refreshHomePage:function(){
        let userInfo = wx.getStorageSync('userInfo');
        if(userInfo == ''){
            this.setData({
                hasUserInfo: false,
            });
        }
        else{
            this.setData({
                hasUserInfo: true,
            });
        }
        this.setData({
            userInfo: userInfo,
        });

        if(this.data.hasUserInfo){
            let that =this;
            user.getFamily().then(res=>{
                if(res.data != '' && res.data != null){
                    that.setData({hasFamily:true,family:res.data})
                }else{
                    that.setData({hasFamily:false,family:{}})
                    that.getInviteRecord();
                }
            })
        }
    },

    goFamilyDetail:function(e){
        let res = util.loginNow();
        if (res == true) {
            wx.navigateTo({
                url: '/pages/family-detail/family-detail?id='+this.data.family.id,
            });
        }
    },

    goInviteRecordPage:function(e){
        let that = this;
        util.request(api.GetMyInviteRecord).then((res)=>{
            //console.info(res);
            if(res.code == 200){
                if(res.data != null && res.data != ''){
                    that.setData({
                        inviteRecord:res.data
                        ,hasInvite:true
                    })
                    wx.navigateTo({
                        url: '/pages/invite-record/invite-record'
                        ,success: function(res) {
                            // 通过eventChannel向被打开页面传送数据
                            res.eventChannel.emit('inviteRecordEven', that.data.inviteRecord)
                        }
                    })
                }else{
                    wx.showToast({
                        title: "没有新的邀请",
                        icon: 'none',
                        duration: 2000
                    })
                }
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 2000
                })
            }
        });
    },

    getInviteRecord: function (e) {
        let that = this;
        util.request(api.GetMyInviteRecord).then((res)=>{
            if(res.code == 200){
                if(res.data != null && res.data != ''){
                    that.setData({
                        inviteRecord:res.data
                        ,hasInvite:true
                    })
                }
            }
        });
    },

    toInvitePage: function(e) {
        let res = util.loginNow();
        if (res == true) {
            wx.navigateTo({
                url: '/pages/invite/invite',
            });
        }
    },

    goAuth: function(e) {
        wx.navigateTo({
            url: '/pages/app-auth/index',
        });
    },

    goCreateFamily: function(e) {
        wx.navigateTo({
            url: '/pages/family-detail/family-detail',
        });
    },

    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.refreshHomePage();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },

    toUserListPage: function(e) {
        let res = util.loginNow();
        if (res) {
            let type = this.data.userInfo.familyOwner == 1 ? 1:2;
            wx.navigateTo({
                url: '/pages/user-list/user-list?type='+type,
            });
        }
    },

    toStatisticsPage: function(e) {
        wx.showToast({
            title: "开发中",
            icon: 'none',
            duration: 1000
        })
    },

    toDailyJob: function(e) {
        wx.showToast({
            title: "开发中",
            icon: 'none',
            duration: 1000
        })
    },
    
})