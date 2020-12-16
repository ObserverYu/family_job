var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        cronList:[],
        allPage: 1,
        allCount: 0,
        showType: 9,
        state:0,
        isMineJob:0, // 0-我发布的 1-我收到的
        count:{},
        hasOrder: 0,
        showTips: 0,
        status: {},
        pageNum:0, // 当前页
        pageSize:5,// 每页条数
        doRefresh:0,
        total:0 // 总条数
        ,familyOwner:2
    },

    onLoad: function(options) {
        this.setData({
            familyOwner:options.familyOwner,
            doRefresh:options.doRefresh
        });
    },
    
    onShow: function() {
        let doRefresh = this.data.doRefresh;
        if (doRefresh == 1) {
            this.setData({
                allPage: 1,
                allCount: 0,
                size: 8,
                doRefresh : 0
            });
            this.getCronList();
        }
        
    },

    getCronList() {
        let that = this;
        //console.info("ingetJobList:"+that.data.pageNum)
        util.request(api.ListFamilyCronJob, {
            pageSize: that.data.pageSize,
            pageNum: that.data.pageNum
        }).then(function(res) {
            console.info(res)
            if (res.code === 200) {
                if(res.data == null || res.data == ''){
                    return true;
                }
                let total = res.data.total;
                that.setData({
                    total: total,
                    cronList: that.data.cronList.concat(res.data.records)
                });
            }
        });
    },


    toCronJobDetails: function(e) {
        let cronJobId = e.currentTarget.dataset.id;
        let familyOwner = this.data.familyOwner;
        wx.navigateTo({
            url: '/pages/create-cron/create-cron?isCreate=0'+'&familyOwner='+familyOwner+'&id='+cronJobId
        })
    },

    toUserListPage: function(e){
        let res = util.loginNow();
        if (res) {
            wx.navigateTo({
                url: '/pages/user-list/user-list?type=3'
            });
        }
    },

    toMyHomePage: function(e) {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    
    onReachBottom: function() {
        let that = this;
        let nowPageCount = that.data.pageNum + 1;
        if (nowPageCount * that.data.pageSize >= that.data.total) {
            that.setData({
                showTips: 1
            });
            return false;
        }
        that.setData({
            pageNum: that.data.pageNum + 1
        });
        that.getCronList();
    }
})