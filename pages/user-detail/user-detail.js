var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        userInfo: {},
        userId: 0,
        canDelete:0,
        edit:0,
        select:0,
        selectToCron:0
    },
    
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        if (options.id) {
            this.getUserDetail(options.id,options);
        }else{
            this.setData({
                canDelete: options.canDelete,
                select:options.select,
                selectToCron:options.selectToCron
            });
        }
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

    deleteUser: function() {
        let id = this.data.userId;
        wx.showModal({
            title: '提示',
            content: '您确定要将该成员移出家庭么？',
            success: function(res) {
                if (res.confirm) {
                    util.request(api.DeleteMember, {
                        id: id
                    }, 'POST').then(function(res) {
                        if (res.code === 200) {
                            util.showErrorToast('移除成功');
                            wx.navigateBack();
                        } else {
                            util.showErrorToast(res.message);
                        }
                    });
                }
            }
        })
    },

    getUserDetail(id,options) {
        let res = util.loginNow();
        if(res){
            let that = this;
            util.request(api.GetUserDetail, {
                userId: id
            }).then(function(res) {
                if (res.code === 200) {
                    that.setData({
                        userInfo: res.data,
                        userId:id
                        ,canDelete: options.canDelete,
                        select:options.select,
                        selectToCron:options.selectToCron
                    });
                    // console.info("顺便更新存储")
                    wx.getStorage({
                        key: 'userInfo',
                        success (res) {
                            if(res.data.id == id){
                                wx.setStorage({
                                    data: res.data,
                                    key: 'userInfo',
                                  })
                            }
                        }
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

    goCreateJobPage: function() {
        let that = this;
        wx.navigateTo({
            url: '/pages/create-job/create-job?isCreate='+1+'&userRole='+1
            ,success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('userInfoEven', that.data.userInfo)
              }
        })
    },

    goCreateCronPage: function() {
        let that = this;
        let login = util.loginNow();
        if(login){
            let userInfo = wx.getStorageSync('userInfo');
            wx.navigateTo({
                url: '/pages/create-cron/create-cron?isCreate=1'+'&familyOwner='+userInfo.familyOwner
                ,success: function(res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('userInfoEven', that.data.userInfo)
                  }
            })
        }

    },
})