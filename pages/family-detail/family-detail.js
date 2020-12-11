var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../services/user.js');
var app = getApp();
Page({
    data: {
        family: {
            id: 0,
            name:''
        },
        familyId:0
    },

    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        if (options.id > 0) {
            let that = this;
            this.setData({
                familyId: options.id
            });
            user.getFamily().then((res)=>{
                if(res.code == 200){
                    that.setData({
                        family:res.data
                    })
                }else{
                    wx.showToast({
                        title: res.message,
                        icon: 'none',
                        duration: 1000,
                        mask:true
                    })
                }

            });
        }
    },

    onReady: function() {

    },
   
    onShow: function() {
        let id = this.data.familyId;
        if (id > 0) {
            wx.setNavigationBarTitle({
                title: '家庭信息',
            })
        } else {
            wx.setNavigationBarTitle({
                title: '新增家庭',
            })
        }
    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭

    },

    bindinputName(event) {
        let family = this.data.family;
        family.name = event.detail.value;
        this.setData({
            family: family
        });
    },



    createFamily() {
        let family = this.data.family;
        if (family.name == '' || family.name == undefined) {
            util.showErrorToast('请输入家庭名');
            return false;
        }
        let that = this;
        util.request(api.CreateFamily, {
            name: family.name,
        }, 'POST').then(function(res) {
            if (res.code === 200) {
                wx.navigateBack()
            }
        });
    },

    updateLocalFamilyInfo(){
        
    }
})