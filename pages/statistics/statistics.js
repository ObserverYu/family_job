var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const user = require('../../services/user.js');
const template = require('../../config/template.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
import * as echarts from '../../ec-canvas/echarts';

var chart = null;

Page({
    data: {
        navList:[{'name':'数量','id':'1'},{'name':'家务点','id':'2'},{'name':'项目','id':'3'}],
        type:1,
        time:1
        ,ec: {
            lazyLoad: true
        }
    },
    
    onLoad: function(options) {
        let type = options.type;
        let time = options.time;
        if(type == null){
            type = 1;
        }
        if(time == null){
            time == 1;
        }
        if(type == null )
        this.setData({
            type:type,
            time:time
        });
        this.chartComponent = this.selectComponent('#mychart-dom-bar');
        let login = util.loginNow()
        if(login){
            let userInfo = wx.getStorageSync('userInfo');
            if(userInfo.familyId == null || userInfo.familyId == ''){
                wx.showToast({
                    title: "请先创建/加入家庭",
                    icon: 'none',
                    duration: 1000,
                    mask:true
                })
                setTimeout(()=>{
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                },1000)
            }else{
                this.initChart();
            }
        }
    },

    onShow: function() {
        let login = util.loginNow()
        if(login){
            let userInfo = wx.getStorageSync('userInfo');
            if(userInfo.familyId == null || userInfo.familyId == ''){
                wx.showToast({
                    title: "请先创建/加入家庭",
                    icon: 'none',
                    duration: 800,
                    mask:true
                })
                setTimeout(()=>{
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                },800)
            }else{
                this.initChart();
            }
        }
    },

    initChart: function (){
        let that = this;
        util.request(api.Statistics,{
            type:this.data.type
            ,time:this.data.time
        }).then((res)=>{
            if(res.code == 200){
                let title = '暂无数据',data = [];
                if(res.data.showData == null || res.data.showData.length == 0){
                    title = "暂无足够的\n"+res.data.title+"统计数据";
                } else{
                    title = res.data.title;
                    data = res.data.showData;
                }
                //console.info(res);
                that.chartComponent.init((canvas, width, height) => {
                    // 初始化图表
                    const barChart = echarts.init(canvas, null, {
                        width: width,
                        height: height
                    });
                    barChart.setOption(that.initChartOption(title,data));
                    chart = barChart;
                    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
                    return barChart;
                });
            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },

    initChartOption:function(title,data){
        let sortData;
        let min,max;
        let show = data.length === 0;
        if(data == null || data == '' || data.length <= 0){
            sortData = []
            min = 0,max = 0
        }else{
            sortData = data.sort(function (a, b) { return a.value - b.value; });       
            min = sortData[0].value/2;
            max = sortData[sortData.length - 1].value*2;
        }
        var option = {
            backgroundColor: '#ffffff',

            title: {
                show: show,
                textStyle:{
                    color: "grey",
                    fontWeight : "lighter",
                    fontSize : 15
                },
                text: title,
                left: "center",
                top: "20%"
            },

            tooltip: {
                trigger: 'item',
                formatter: '{a} {b} <br/>: {c} ({d}%)'
                ,position:['10%','10%']
            },

            visualMap: {
                show: false,
                min: min,
                max: max,
                inRange: {
                    colorLightness: [0, 1]
                }
            },

            legend: {
                show:!show,
                type: 'plain',
                orient: 'horizontal',
                bottom : '20%',
                formatter:  function(name){
                    if(sortData.length == 0){
                        return '无数据'
                    }
                    var total = 0;
                    var target;
                    for (var i = 0, l = sortData.length; i < l; i++) {
                        total += sortData[i].value;
                        if (sortData[i].name == name) {
                            target = sortData[i].value;
                        }
                    }
                    return name + ' '+target+'(' + ((target/total)*100).toFixed(2) + '%)';
                }
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '35%'],
                    data: sortData,
                    roseType: 'radius',
                    label: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    labelLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    },
                    itemStyle: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
        
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
        return option;
    },

    switchTab: function(event) {
        let time = event.currentTarget.dataset.time;
        let nowTime = this.data.time;
        if(time == nowTime){
            return false;
        }
        this.setData({
            time: time
        });
        this.refreshChartData(time,this.data.type);
    },

    switchCate: function(e) {
        let type = e.currentTarget.dataset.id;
        let nowType = this.data.type;
        if (type == nowType) {
            return false;
        } 
        this.setData({
            type:type
        })
        this.refreshChartData(this.data.time,type);
    },

     setChartOption:function(title,data){
        let sortData;
        let min,max;
        let show = data.length === 0;
        if(data == null || data == '' || data.length <= 0){
            sortData = []
            min = 0,max = 0
        }else{
            sortData = data.sort(function (a, b) { return a.value - b.value; });       
            min = sortData[0].value/2;
            max = sortData[sortData.length - 1].value*2;
        }

        let option = {
            title: {
                show: show,
                text: title,
            },

            series: [
                {
                    name: title,
                    data: sortData
                }
            ]
            ,visualMap: {
                min: min,
                max: max,
            }
            ,legend: {
                show:!show,
                formatter:  function(name){
                    var total = 0;
                    var target;
                    for (var i = 0, l = sortData.length; i < l; i++) {
                        total += sortData[i].value;
                        if (sortData[i].name == name) {
                            target = sortData[i].value;
                        }
                    }
                    return name + ' '+target+'(' + ((target/total)*100).toFixed(2) + '%)';
                }
            },
        }
        chart.setOption(option);
    },

    refreshChartData: function(time,type){
        let that = this;
        that.setData({
            loading:0
        })
        util.request(api.Statistics,{
            type:type
            ,time:time
        }).then((res)=>{
            if(res.code == 200){
                let title = '暂无数据',data = [];
                if(res.data.showData == null || res.data.showData.length == 0){
                    title = "暂无足够的\n"+res.data.title+"统计数据";
                } else{
                    title = res.data.title;
                    data = res.data.showData;
                }
                that.setChartOption(title,data);

            }else{
                wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
        
    }

})