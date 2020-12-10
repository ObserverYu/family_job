var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        orderList: [],
        allJobList: [],
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
    toOrderDetails: function(e) {
        let jobUserId = e.currentTarget.dataset.id;
        let userRole = this.data.isMineJob == 0 ? 1:0;
        wx.navigateTo({
            url: '/pages/create-job/create-job?isCreate=0'+'&userRole='+userRole+'&id='+jobUserId
        })
    },
    payOrder: function(e) {
        let orderId = e.currentTarget.dataset.orderid;
        let that = this;
        pay.payOrder(parseInt(orderId)).then(res => {
            let showType = wx.getStorageSync('showType');
            that.setData({
                showType: showType,
                orderList: [],
                allOrderList: [],
                allPage: 1,
                allCount: 0,
                size: 8
            });
            that.getOrderList();
            that.getOrderInfo();
        }).catch(res => {
            util.showErrorToast(res.errmsg);
        });
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
        console.info("ingetJobList:"+that.data.pageNum)
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
                console.info("joblist:")
                console.info(that.data.jobList)
            }
        });
    },
    toIndexPage: function(e) {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    onLoad: function(options) {
        console.info("onload")
        this.setData({
            isMineJob:options.isMineJob,
            state:options.state,
            doRefresh: options.doRefresh
        });
    },
    onShow: function() {
        console.info("onshow")
        let doRefresh = this.data.doRefresh;
        if (doRefresh == 1) {
            this.setData({
                orderList: [],
                allOrderList: [],
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
    // “取消订单”点击效果
    cancelOrder: function(e) {
        let that = this;
        let orderId = e.currentTarget.dataset.index;
        wx.showModal({
            title: '',
            content: '确定要取消此订单？',
            success: function(res) {
                if (res.confirm) {
                    util.request(api.OrderCancel, {
                        orderId: orderId
                    }, 'POST').then(function(res) {
                        if (res.errno === 0) {
                            wx.showToast({
                                title: '取消订单成功'
                            });
                            that.setData({
                                orderList: [],
                                allOrderList: [],
                                allPage: 1,
                                allCount: 0,
                                size: 8
                            });
                            that.getOrderList();
                        } else {
                            util.showErrorToast(res.errmsg);
                        }
                    });
                }
            }
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
        console.info("flush")
        console.info("inBottom1:"+that.data.pageNum)
        that.setData({
            pageNum: that.data.pageNum + 1
        });
        console.info("inBottom2:"+that.data.pageNum)
        that.getJobList();
    }
})