var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        jobTypeArray:[],
        chosenTypeName:'',
        chosenTypeId:-1,
        jobName:'',
        points:null
    },

    onLoad: function(options) {
        let login = util.loginNow();
        if(!login){
            return;
        }
        let that = this;
        util.request(api.ListAllType).then(function(res) {
            if (res.code === 200) {
                that.setData({
                    jobTypeArray:res.data
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

    bindinputPoints(event) {
        var points = event.detail.value.replace(/^(0+)|[^\d]+/g,'');
        this.setData({
            points:points
        });
    },

    bindTypeChange:function(e){
        let index = e.detail.value;
        this.setData({
            chosenTypeId:this.data.jobTypeArray[index].id,
            chosenTypeName:this.data.jobTypeArray[index].name
        })
    },

    bindinputName(event) {
        let jobName = event.detail.value;
        this.setData({
            jobName:jobName
        });
    },


    saveCronJob() {
        let jobName = this.data.jobName;
        let chosenTypeId = this.data.chosenTypeId;
        let points = this.data.points;
        if(chosenTypeId <= 0){
            util.showErrorToast('请选择家务类别');
            return false;
        }
        if(jobName == null || jobName == ''){
            util.showErrorToast('请输入家务名');
            return false;
        }
        if(points == null || points < 0){
            util.showErrorToast('请输入作为额外任务时获得的家务点数');
            return false;
        }
        wx.showLoading({
            title: '创建中',
            mask:true
          })
        util.request(api.CreateCustomizedJob,{
            typeId:chosenTypeId
            ,jobName:jobName
            ,points:points
        } ,'POST')
        .then(function(res) {
            wx.hideLoading()
            if (res.code === 200) {
                wx.showToast({
                    title: "创建成功",
                    icon: 'none',
                    duration: 500,
                    mask:true
                })
                setTimeout(()=>{
                    wx.reLaunch({
                        url: '/pages/customized-job-type/customized-job-type?doRefresh=1&familyOwner=1'
                    })
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