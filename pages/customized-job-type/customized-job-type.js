var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        typeList:[],
        doRefresh:0
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
            this.getTypeList();
        }
        
    },

    getTypeList() {
        let that = this;
        //console.info("ingetJobList:"+that.data.pageNum)
        util.request(api.GetCustomizedJobType).then(function(res) {
            console.info(res)
            if (res.code === 200) {
                if(res.data == null || res.data == ''){
                    return true;
                }
                let total = res.data.total;
                that.setData({
                    total: total,
                    typeList: res.data
                });
            }
        });
    },

    toCustomizedJobList: function(e) {
        let typeId = e.currentTarget.dataset.id;
        let familyOwner = this.data.familyOwner;
        wx.navigateTo({
            url: '/pages/customized-job-list/customized-job-list?&familyOwner='+familyOwner+'&id='+typeId
        })
    },

    toCreatePage: function(e){
        let res = util.loginNow();
        if (res) {
            wx.navigateTo({
                url: '/pages/create-customized-job/create-customized-job'
            });
        }
    },
    
})