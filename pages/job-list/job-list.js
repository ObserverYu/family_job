var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        jobList:[],
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
    },

    toJobDetails: function(e) {
        let jobUserId = e.currentTarget.dataset.id;
        let userRole = this.data.isMineJob == 0 ? 1:0;
        wx.navigateTo({
            url: '/pages/create-job/create-job?isCreate=0'+'&userRole='+userRole+'&id='+jobUserId
        })
    },

    jobCount: function(e) {
        let that = this;
        util.request(api.JobCountInfo).then(function(res) {
            if (res.code === 200) {
                let count = res.data;
                that.setData({
                    count: count
                });
            }
        });
    },

    getJobList() {
        let that = this;
        //console.info("ingetJobList:"+that.data.pageNum)
        util.request(api.ListMyJob, {
            state: that.data.state,
            pageSize: that.data.pageSize,
            pageNum: that.data.pageNum,
            isMineJob: that.data.isMineJob
        }).then(function(res) {
            if (res.code === 200) {
                if(res.data == null || res.data == ''){
                    return true;
                }
                let total = res.data.total;
                that.setData({
                    total: total,
                    jobList: that.data.jobList.concat(res.data.records)
                });
            }
        });
    },

    toIndexPage: function(e) {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    
    onLoad: function(options) {
        this.setData({
            isMineJob:options.isMineJob,
            state:options.state,
            doRefresh: options.doRefresh
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
            this.getJobList();
            this.jobCount();
        }
        
    },

    switchTab: function(event) {
        let state = event.currentTarget.dataset.state;
        this.setData({
            state: state,
            jobList: [],
            allJobList: [],
            allPage: 1,
            allCount: 0,
            pageSize: 5,
            pageNum:0
        });
        this.jobCount();
        this.getJobList();
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
        that.getJobList();
    }
})