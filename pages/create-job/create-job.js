var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
    data: {
        jobUserId:0,
        creatorNickName:'',
        creatorId:0,
        creatorAvatar:'',
        userId:0,
        userAvatar:'',
        userNickName:'',
        nowDate:'',
        objectMultiShow:[],
        objectMultiArray:[],
        multiArray: [],
        multiIndex: [0,0],
        date:'',
        canStep:0,
        costStep:null,
        state:-1,
        isCreate:0,
        remark:null,
        userRole:0  // 用户角色:0接受者 1创建者 2其他
        ,chosenJobName: ''
        ,chosenJobId: 0
    },

    bindinputRemark(event) {
        this.setData({
            remark: event.detail.value
        });
    },

    bindinputCostStep(event) {
        var costStep = event.detail.value.replace(/^(0+)|[^\d]+/g,'');
        this.setData({
            costStep: costStep
        });
    },
    
    onLoad: function(options) {
        util.loginNow();
        let userInfo = wx.getStorageSync('userInfo');

        let isCreate = options.isCreate;
        let userRole = options.userRole;
        this.setData({
            isCreate : isCreate
            ,userRole:userRole
        });
        if(isCreate == 1){
            // 创建任务页面
            let that = this;
            const eventChannel = this.getOpenerEventChannel()
            // 监听事件，获取上一页面通过eventChannel传送到当前页面的数据
            eventChannel.on('userInfoEven', function(userInfo) {
                that.setData({
                    userAvatar:userInfo.avatar
                    ,userId:userInfo.id
                    ,userNickName:userInfo.nickName
                })
            })
            var now = new Date();
            // 页面初始化 options为页面跳转所带来的参数
            this.setData({
                creatorNickName: userInfo.nickName,
                creatorId: userInfo.id,
                creatorAvatar:userInfo.avatar,
                nowDate :now.toLocaleDateString()});   

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
            let jobUserId = options.id;
            if(id > 0){
                // 获取jobUser信息
                
            }
        }
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
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
           multiIndex: e.detail.value,
           chosenJobName: this.data.multiArray[1][e.detail.value[1]],
           chosenJobId: this.data.objectMultiShow[1][e.detail.value[1]].id
        })
    },

    bindMultiPickerColumnChange: function (e) {
        console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
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
    
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          date: e.detail.value
        })
    },

    switchChange(e) {
        let status = e.detail.value;
        let canStep = 0;
        if (status == true) {
            canStep = 1;
        }
        this.setData({
            canStep: canStep
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

    saveJobUser() {
        console.info(this.data);
        let multiIndex = this.data.multiIndex;
        let userId = this.data.userId;
        let date = this.data.date;
        let canStep = this.data.canStep;
        let costStep = this.data.costStep;
        let remark = this.data.remark;
        if(multiIndex.length < 2){
            util.showErrorToast('请选择任务');
            return false;
        }
        if(date == null || date == ''){
            util.showErrorToast('请选择过期时间');
            return false;
        }
        if(canStep == 1 && costStep < 10000){
            util.showErrorToast('步数必须大于10000');
            return false;
        }
        let jobId = this.data.chosenJobId;
        let param = {
            userId : userId,
            jobId : jobId,
            expireTime : date,
            desc : remark,
            canStep : canStep,
            costStep : costStep
        }
        console.info(param);
        wx.showLoading({
            title: '提交中',
            mask:true
          })
        util.request(api.CreateJobToUser, param, 'POST')
        .then(function(res) {
            wx.hideLoading()
            if (res.code === 200) {
                wx.reLaunch({
                  url: '../success-page/success-page?status=1',
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
})