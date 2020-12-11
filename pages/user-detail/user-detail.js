var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        userInfo: {},
        userId: 0,
        canDelete:0,
        edit:0,
        select:0
    },
    
    onLoad: function(options) {
        console.info("detail:"+options.select +"   "+options.canDelete)
        this.setData({
            canDelete: options.canDelete,
            select:options.select
        });
        // 页面初始化 options为页面跳转所带来的参数
        if (options.id) {
            this.setData({
                userId: options.id
            });
            this.getUserDetail();
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

    getUserDetail() {
        let res = util.loginNow();
        if(res){
            let that = this;
            util.request(api.GetUserDetail, {
                userId: that.data.userId
            }).then(function(res) {
                if (res.code === 200) {
                    that.setData({
                        userInfo: res.data
                    });
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

    saveAddress() {
        let address = this.data.address;
        if (address.name == '' || address.name == undefined) {
            util.showErrorToast('请输入姓名');
            return false;
        }
        if (address.mobile == '' || address.mobile == undefined) {
            util.showErrorToast('请输入手机号码');
            return false;
        }
        if (address.district_id == 0 || address.district_id == undefined) {
            util.showErrorToast('请输入省市区');
            return false;
        }
        if (address.address == '' || address.address == undefined) {
            util.showErrorToast('请输入详细地址');
            return false;
        }
        let that = this;
        util.request(api.SaveAddress, {
            id: address.id,
            name: address.name,
            mobile: address.mobile,
            province_id: address.province_id,
            city_id: address.city_id,
            district_id: address.district_id,
            address: address.address,
            is_default: address.is_default,
        }, 'POST').then(function(res) {
            if (res.errno === 0) {
                wx.navigateBack()
            }
        });
    },
})