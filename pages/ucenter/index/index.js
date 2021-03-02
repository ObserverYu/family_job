var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
const template = require('../../../config/template.js');
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
        }else{
            this.setData({
                hasUserInfo: 1,
            });
        }
        this.setData({
            userInfo: userInfo,
        });
        this.getHomeInfo(userInfo);
    },

    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.getHomeInfo();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },

    getHomeInfo: function(userInfoSt) {
        let that = this;
        util.request(api.HomePageInfo).then(function(res) {
            if (res.code === 200) {
                let status = res.data.jobCountInfo;
                let userInfo = that.data.userInfo;
                userInfo.points = res.data.myUserInfo.points;
                that.setData({
                    status: status,
                    userInfo: userInfo
                });
                wx.setStorageSync('userInfo', userInfo)
            }
        });
    },

    goProfile: function (e) {
        let res = util.loginNow();
        if (res == true) {
            user.refreshUserInfo();
            wx.navigateTo({
                url: '/pages/ucenter/settings/settings',
            });
        }
    },

    toJobListTap: function(event) {
        let res = util.loginNow();
        if (res == true) {
            user.checkSendMsgReal(template.RENWUTIXING);
            let isminejob = event.currentTarget.dataset.isminejob;
            let state = event.currentTarget.dataset.state;
            wx.navigateTo({
                url: '/pages/job-list/job-list?isMineJob=' + isminejob + '&state=' + state + '&doRefresh=1',
            });
        }
    },

    toUserList: function(e) {
        let res = util.loginNow();
        if (res == true) {
            user.checkSendMsgReal(template.RENWUTIXING);
            wx.navigateTo({
                url: '/pages/user-list/user-list?type=0',
            });
        }
    },

    goAuth: function(e) {
        wx.navigateTo({
            url: '/pages/app-auth/index',
        });
    },

    toReceiveJobUserPage:function(e){
        let res = util.loginNow();
        if (res) {
            let userInfo = wx.getStorageSync('userInfo');
            let watchdogId = userInfo.watchdogId;
            if(watchdogId == null || watchdogId == 0){
                user.getUserInfo().then((res)=>{
                    if(res.code == 200){
                        let realUserInfo = res.data;
                        if(realUserInfo.watchdogId == null){
                            console.info("还是没有")
                            wx.showToast({
                                title: "您还未设置监督人",
                                icon: 'none',
                                duration: 1000
                            })
                        }else{
                            console.info("有了")
                            user.checkSendMsgReal(template.RENWUTIXING);
                            wx.navigateTo({
                                url: '/pages/create-job/create-job?isCreate='+2+'&userRole=0'
                            });
                        }
                        wx.setStorage({
                            data: realUserInfo,
                            key: 'userInfo',
                          })
                    }
                })
                return;
            }
            user.checkSendMsgReal(template.RENWUTIXING);
            wx.navigateTo({
                url: '/pages/create-job/create-job?isCreate='+2+'&userRole=0'
            });
        }
    },
})