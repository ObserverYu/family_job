var util = require('utils/util.js');
var api = require('config/api.js');
var template = require('config/template.js');
App({
    data: {
        deviceInfo: {}
    },
    onLaunch: function() {
        this.data.deviceInfo = wx.getSystemInfoSync();
        // 动态设置模板id
        wx.request({
          url: api.GetTemplateId,
          success(res){
            if(res.data.code == 200){
                template.setTemplate(res.data.data);
            }
          }
        })

       // console.log(this.data.deviceInfo);
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // // 登录
        // wx.login({
        //     success: res => {
        //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //     }
        // })

        let that = this;
        wx.getSystemInfo({ //  获取页面的有关信息
            success: function(res) {
                wx.setStorageSync('systemInfo', res)
                var ww = res.windowWidth;
                var hh = res.windowHeight;
                that.globalData.ww = ww;
                that.globalData.hh = hh;
            }
        });

    },
    onShow:function(){
        console.log("登录");
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: {
            nickname: '点我登录',
            username: '点击登录',
            avatar: ''
        },
        token: '',
        family:{
            name:'点我创建家庭'
        }
    }

})