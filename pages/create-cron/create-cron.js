var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        cronJob:{
            id : 0,
            canStep:0
        },
        cronTypeArray:['每周','每日','每月'],
        cronTypeIndex:0,
        chosenCronTypeStr:'',
        objectMultiShow:[],
        objectMultiArray:[],
        multiArray: [],
        multiIndex: [0,0],
        isCreate:0,
        familyOwner:0  // 0-暂未加入 1-拥有者  2-成员 3-被邀请中
        ,chosenJobName: ''
        ,chosenJobId: 0
    },

    bindinputRemark(event) {
        let cronJob = this.data.cronJob;
        cronJob.remark = event.detail.value;
        this.setData({
            cronJob:cronJob
        });
    },

    bindinputCostStep(event) {
        var costStep = event.detail.value.replace(/^(0+)|[^\d]+/g,'');
        let cronJob = this.data.cronJob;
        cronJob.costStep = costStep;
        this.setData({
            cronJob:cronJob
        });
    },

    
    bindinputPoints(event) {
        var points = event.detail.value.replace(/^(0+)|[^\d]+/g,'');
        let cronJob = this.data.cronJob;
        cronJob.points = points;
        this.setData({
            cronJob:cronJob
        });
    },

    bindinputTimes(event) {
        var times = event.detail.value.replace(/^(0+)|[^\d]+/g,'');
        let cronJob = this.data.cronJob;
        cronJob.times = times;
        this.setData({
            cronJob:cronJob
        });
    },
    
    onLoad: function(options) {
        let login = util.loginNow();
        if(!login){
            return;
        }
        let isCreate = options.isCreate;
        let familyOwner = options.familyOwner;
        let that = this;
        let cronJob = this.data.cronJob;
        if(isCreate == 1){
            let creatorInfo = wx.getStorageSync('userInfo');
            // 创建任务页面
            const eventChannel = this.getOpenerEventChannel()
            // 监听事件，获取上一页面通过eventChannel传送到当前页面的数据
            eventChannel.on('userInfoEven', function(userInfo) {
                cronJob.userAvatar = userInfo.avatar
                cronJob.userId = userInfo.id
                cronJob.userName = userInfo.nickName
                
                cronJob.watchdogName = userInfo.watchdogName
                cronJob.watchdogId = userInfo.watchdogId
                cronJob.watchdogAvatar = userInfo.watchdogAvatar

                cronJob.creatorName = creatorInfo.nickName
                cronJob.creatorAvatar = creatorInfo.avatar
                cronJob.creatorId = creatorInfo.id

                that.setData({
                    cronJob : cronJob
                    ,isCreate : isCreate
                    ,familyOwner:familyOwner
                })
            })
            // 构造家务多列选择器  
            util.request(api.ListAllJobTypeAndInfo).then(function(res) {
                if (res.code === 200) {
                    that.initMuitlSelect(res.data);
                }else{
                    wx.showToast({
                        title: res.message,
                        icon: 'none',
                        duration: 2000
                    })
                }
            });
        }else{
            let cronJobId = options.id;
            if(cronJobId > 0){
                // 获取cron信息
                util.request(api.CronJobDetail,{
                    cronJobId:cronJobId
                }).then(function(res) {
                    //console.info(res)
                    if (res.code === 200) {
                        that.refreshCronJob(res,isCreate,familyOwner);
                    }else{
                        wx.showToast({
                            title: res.message,
                            icon: 'none',
                            duration: 2000
                        })
                    }
                });
            }
        }

    },

    bindCronTypeChange:function(e){
        let type = e.detail.value;
        let cronJob = this.data.cronJob;
        cronJob.type = type;
        this.setData({
            cronJob:cronJob,
            cronTypeIndex:type,
            chosenCronTypeStr:this.data.cronTypeArray[type]
        })
    },

    refreshCronJob: function(res,isCreate,familyOwner){
        this.setData({
            cronJob:res.data
            ,isCreate:isCreate
            ,familyOwner:familyOwner
        });

    },

    initMuitlSelect:function(res){
        let objectMultiArray = [[],[]]
        objectMultiArray[0] = res.jobTypeList;
        objectMultiArray[1] = res.jobInfoList;
        let objectMultiShow = objectMultiArray.map((item, index) => {
            if (index > 0) {
                item = item.filter(i => i.typeId === objectMultiArray[index - 1][0].id)
            }
            return item
        });
        let multiArray = objectMultiShow.map(item => {
            item = item.map(i => i.name)
            return item
        });
        // 数据更新
        this.setData({
                multiArray:multiArray,
                objectMultiShow:objectMultiShow,
                objectMultiArray:objectMultiArray
            }
        )
    },

    bindMultiPickerChange: function (e) {
        this.setData({
           multiIndex: e.detail.value,
           chosenJobName: this.data.multiArray[1][e.detail.value[1]],
           chosenJobId: this.data.objectMultiShow[1][e.detail.value[1]].id
        })
    },

    bindMultiPickerColumnChange: function (e) {
        // 初始化数据
        var data = {
            objectMultiShow: this.data.objectMultiShow,
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };

        // 改变第i列数据之后，后几列选择第0个选项（重置）
        data.multiIndex[e.detail.column] = e.detail.value;
        for (let i = e.detail.column; i < data.multiIndex.length - 1; i++) {
            data.multiIndex[i + 1] = 0
        }
        let arry = this.data.objectMultiArray
        for (let i = e.detail.column; i < data.multiIndex.length - 1; i++) {
            data.objectMultiShow[i + 1] = arry[i + 1].filter(item => item.typeId === data.objectMultiShow[i][data.multiIndex[i]].id)
            data.multiArray[i + 1] = data.objectMultiShow[i + 1].map(item => item.name)
        }
        // 数据更新
        this.setData(data);
    },

    switchChange(e) {
        let status = e.detail.value;
        let canStep = 0;
        if (status == true) {
            canStep = 1;
        }
        let cronJob = this.data.cronJob;
        cronJob.canStep = canStep
        this.setData({
            cronJob:cronJob
        });
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

    saveCronJob() {
        let multiIndex = this.data.multiIndex;
        let canStep = this.data.cronJob.canStep;
        let costStep = this.data.cronJob.costStep;
        let points = this.data.cronJob.points;
        let cronType = this.data.cronJob.type;
        let times = this.data.cronJob.times;
        if(times == null || times == 0 || times > 30){
            util.showErrorToast('请输入正确的频次,不能大于30');
            return false;
        }
        if(cronType == null){
            util.showErrorToast('请选择定时类型');
            return false;
        }
        if(points == null){
            util.showErrorToast('请输入家务点');
            return false;
        }
        if(multiIndex.length < 2){
            util.showErrorToast('请选择任务');
            return false;
        }
        if(canStep == 1 ){
            if(costStep == null || costStep == '' || costStep < 10000){
                util.showErrorToast('步数必须大于10000');
                return false;
            }
        }
        let param = this.data.cronJob;
        let jobId = this.data.chosenJobId;
        param.jobId = jobId;
        wx.showLoading({
            title: '创建中',
            mask:true
          })
        util.request(api.CreateCronJob, param, 'POST')
        .then(function(res) {
            wx.hideLoading()
            if (res.code === 200) {
                wx.reLaunch({
                  url: '../success-page/success-page?status=3',
                })
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },

    disableCronJob() {
        wx.showLoading({
            title: '提交中',
            mask:true
        })
        let that = this;
        util.request(api.CloseCronJob, {
            cronJobId:this.data.cronJob.id
        },'POST').then(function(res) {
            wx.hideLoading()
            if (res.code === 200) {
                wx.showToast({
                    title: "操作成功",
                    icon: 'none',
                    duration: 500,
                    mask:true
                })
                setTimeout(()=>{
                    wx.reLaunch({
                        url: '/pages/cron-list/cron-list?familyOwner=1&doRefresh=1',
                    });
                },500)
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },

    enableCronJob() {
        wx.showLoading({
            title: '提交中',
            mask:true
        })
        let that = this;
        util.request(api.OpenCronJob, {
            cronJobId:this.data.cronJob.id
        },'POST').then(function(res) {
            wx.hideLoading()
            if (res.code === 200) {
                wx.showToast({
                    title: "操作成功",
                    icon: 'none',
                    duration: 500,
                    mask:true
                })
                setTimeout(()=>{
                    wx.reLaunch({
                        url: '/pages/cron-list/cron-list?familyOwner=1&doRefresh=1',
                    });
                },500)
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },

    deleteCronJob() {
        wx.showLoading({
            title: '提交中',
            mask:true
        })
        let that = this;
        util.request(api.DeleteCronJob, {
            cronJobId:this.data.cronJob.id
        },'POST').then(function(res) {
            wx.hideLoading()
            if (res.code === 200) {
                wx.showToast({
                    title: "操作成功",
                    icon: 'none',
                    duration: 500,
                    mask:true
                })
                setTimeout(()=>{
                    wx.reLaunch({
                        url: '/pages/cron-list/cron-list?familyOwner=1&doRefresh=1',
                    });
                },500)
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },

})