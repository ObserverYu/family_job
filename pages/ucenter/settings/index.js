var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
    data: {
        name: '',
        mobile: '',
        status: 0,
        inviteCode:''
    },
    // 复制
  copyTBL: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.inviteCode,
      success: function (res) {
        // self.setData({copyTip:true}),
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
    mobilechange(e) {
        let mobile = e.detail.value;
        this.setData({
            mobile: mobile,
            status: 0
        });
        if (util.testMobile(mobile)) {
            this.setData({
                mobile: mobile,
                status: 1
            });
        }
    },
    bindinputName(event) {
        let name = event.detail.value;
        let mobile = this.data.mobile;
        this.setData({
            name: name,
        });
        if (util.testMobile(mobile)) {
            this.setData({
                status: 1
            });
        }
    },
    getSettingsDetail() {
        let res = util.loginNow();
        if(res){
            let userInfo = wx.getStorageSync('userInfo')
            this.setData({
                inviteCode:userInfo.inviteCode
            })
        }
    },
    onLoad: function(options) {
        this.getSettingsDetail();
    },
    saveInfo() {
        let name = this.data.name;
        let mobile = this.data.mobile;
        let status = this.data.status;
        if (name == '') {
            util.showErrorToast('请输入姓名');
            return false;
        }
        if (mobile == '') {
            util.showErrorToast('请输入手机号码');
            return false;
        }
        let that = this;
        util.request(api.SaveSettings, {
            name: name,
            mobile: mobile,
        }, 'POST').then(function(res) {
            if (res.errno === 0) {
                util.showErrorToast('保存成功');
                wx.navigateBack()
            }
        });
    },
})