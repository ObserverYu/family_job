var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp()
Page({
    data: {
        users: [],
        type:0    // 0-任务选择页面进入列表  1-家长进入  2-成员进入 3-家长添加定时任务进入
    },

    goUserDetail: function(e) {
        let id = e.currentTarget.dataset.userid;
        let select = 0;
        let canDelete = 0;
        let selectToCron = 0;
        let changeWatchdog = 0;
        let login = util.loginNow();
        if(login){
            let user = wx.getStorageSync('userInfo');
            if(this.data.type == 0 && id == user.id){
                wx.showToast({
                    title: "不能对自己发布",
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if(this.data.type == 0){
                select = 1;
            }else if(this.data.type == 1){
                canDelete = 1;
                changeWatchdog = 1;
            }else if (this.data.type == 2){
                changeWatchdog = 1;
            }else if (this.data.type == 3){
                select = 0;
                selectToCron = 1;
            }
            //console.info("list:"+select+"    "+canDelete)
            wx.navigateTo({
                url: '/pages/user-detail/user-detail?select='+select
                +'&canDelete='+canDelete+'&id=' + id + "&selectToCron=" + selectToCron + "&changeWatchdog="+changeWatchdog,
            })
        }


    },

    getUsers() {
        let res = util.loginNow();
        if(res){
            let that = this;
            util.request(api.GetUsers).then(function(res) {
                if (res.code === 200) {
                    that.setData({
                        users: res.data.userList
                    })
                }
            });
        }
    },
    selectUser:function(e) {
        let userId = e.currentTarget.dataset.userId
        wx.setStorageSync('addressId', addressId);
        wx.navigateBack();
    },
    onLoad: function(options) {
        let type = options.type;
        this.setData({
            type: type
        })
    },
    onUnload: function() {},
    onShow: function() {
        let type = this.data.type;
        // 0-任务选择页面进入列表  1-家长进入  2-成员进入 3-家长添加定时任务进入
        let title = '成员列表'
        if(type == 0){
            title = "选择指派对象"
        }else if(type == 3){
            title = "选择设置对象"
        }
        wx.setNavigationBarTitle({
            title: title
        })
        this.getUsers();
    },

    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        this.getUsers();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    }
})