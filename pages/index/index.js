var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var template = require('../../config/template.js');
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
        user.refreshSetting();
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
        user.refreshUserInfo();
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

    toCronJob: function(e) {
        let res = util.loginNow();
        if (res) {
            let templateId = template.RENWUTIXING;
            user.checkSendMsgReal(templateId);
            // let ask = this.checkSendMsg(templateId);
            // if(ask){
            //     console.info("是否可以询问:"+ask)
            //     this.askSub(templateId);
            // }
            wx.navigateTo({
                url: '/pages/cron-list/cron-list?doRefresh=1&familyOwner='+this.data.userInfo.familyOwner
            });
        }
    }, 

    checkSendMsg:function(templateId){
        console.info("开始鉴别")
        let settings = wx.getStorageSync('settings');
        let userInfo = wx.getStorageSync('userInfo');

        if(settings == null || settings == ''){
            return false;
        }
        let subSetting = settings.subscriptionsSetting;
        console.info(subSetting);
        if(!subSetting.mainSwitch){
            console.info("总开关关闭 不再询问");
            return false;
        }
        let hasProp = subSetting.hasOwnProperty("itemSettings");
        if(hasProp){
            hasProp = subSetting.itemSettings.hasOwnProperty(templateId);
        }
        if(!hasProp){
            console.info("用户没有设置任何不再询问,查询是否有拒绝历史")
            if(userInfo == '' || userInfo == null){
                console.info('找不到用户信息')
                return false;
            }
            if(userInfo.canSend == 0){
                console.info("没有拒绝历史,且当前订阅次数没有授权或已使用,询问")
                return true;
            }
        }else{
            let tixing = subSetting.itemSettings[templateId];
            if(tixing == 'accept'){
                console.info("用户设置了接受不再询问,可以询问");
                return true;
            }
            if(tixing == 'reject' || tixing == 'ban' ){
                if(userInfo.canSend != 2){
                   user.updateSendMsg(2);
                }
            }
        }
        return false;
    },

    askSub:function(templateId){
        wx.requestSubscribeMessage({
            tmplIds: [templateId],
            success (res) {
                console.info("成功:"+res)
                let userClick = res[templateId];
                if(userClick == 'accept'){
                    user.updateSendMsg(1)
                }else if(userClick == 'ban' || userClick == 'reject'){
                    user.updateSendMsg(2)
                }
            }
            ,fail(res){
                console.info("询问失败:"+res.errMsg)
            }
        })
    }

})