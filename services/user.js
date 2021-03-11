/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');
const template = require('../config/template.js');
var app = getApp();
/**
 * 调用微信登录
 */
function loginByWeixin() {
    console.log("调用登录");
    let code = null;
    let userInfoOut = null;
    return new Promise(function(resolve, reject) {
        return util.login().then((res) => {
            code = res.code;
            return util.getUserInfo();
        }).then((userInfo) => {
            //登录远程服务器
            userInfoOut = userInfo;
            // console.log("获取到的userInfo2:"+userInfoOut);
            // console.log(JSON.stringify(userInfoOut))
            return util.request(api.AuthLoginByWeixin, {
                code: code,
                fullUserInfo: userInfoOut
            }, 'POST').then(res => {
                if (res.code === 200) {
                    //存储用户信息
                    wx.setStorageSync('userInfo', res.data.userInfo);
                    wx.setStorageSync('token', res.data.token);
                    resolve(res);
                } else {
                    reject(res);
                }
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    });
}

/**
 * 获取家庭信息
 */
function getFamily() {
    return util.request(api.GetFamily, {});
}

/**
 * 更新个人信息
 */
function refreshUserInfo() {
    util.request(api.GetMyUserInfo,"GET").then((res)=>{
        if(res.code == 200){
            wx.setStorageSync('userInfo', res.data)
        }
    });
}

/**
 * 获取个人信息
 */
function getUserInfo() {
    return util.request(api.GetMyUserInfo,"GET");
}

/**
 * 更新订阅权限
 */
function updateSendMsg(canSend) {
    util.request(api.FreshSendMsg, {
        canSend:canSend
    },"POST").then((res)=>{
        if(res.code == 200){
            wx.getStorage({
              key: 'userInfo',
              success(res){
                let userInfo = res.data;
                userInfo.canSend = canSend;
                wx.setStorage({
                  data: userInfo,
                  key: 'userInfo',
                })
              }
            })

        }
    });
}

/**
 * 更新订阅权限
 */
function updateSendMsgNew(canSendEntiry) {
    util.request(api.FreshSendMsgNew, {
        canSendEntiry:canSendEntiry
    },"POST").then((res)=>{
        if(res.code == 200){
            wx.getStorage({
              key: 'userInfo',
              success(res){
                let userInfo = res.data;
                userInfo.canSendEntiry = canSendEntiry;
                wx.setStorage({
                  data: userInfo,
                  key: 'userInfo',
                })
              }
            })

        }
    });
}

function askForSubAndUpdate(templateId){
    let that = this;
    //console.info("开始询问")
    wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success (res) {
            //console.info("拉起鉴权询问成功")
            let userClick = res[templateId];
            if(userClick == 'accept'){
                //console.info("用户接受")
                that.updateSendMsg(1)
            }else if(userClick == 'ban' || userClick == 'reject'){
                //console.info("用户拒绝")
                that.updateSendMsg(2)
            }
        }
        ,fail(res){
            //console.info("询问失败:"+res.errMsg)
        }
    })
}

function sendMsgIterator(canSend){
    
}

function checkSendMsgRealNew(templateList){
    let that = this;
    let localUserInfo = wx.getStorageSync('userInfo');
    wx.getSetting({
        withSubscriptions: true,
        success(settings){
            console.info("获取设置成功");
            let subSetting = settings.subscriptionsSetting;
            console.info(subSetting);
            wx.setStorage({
                data: settings,
                key: 'settings',
            })
            if(!subSetting.mainSwitch){
                console.info("总开关关闭 不再询问");
                let localCanSendEntiry = localUserInfo.canSendEntiry;
                let shoudUpdate = false;
                for(var i = 0; i < templateList.length ; i++){
                    let templateId = templateList[i];
                    if(localCanSendEntiry[templateId] != 2){
                        shoudUpdate = true;
                    } 
                }
                if(shoudUpdate){
                    console.info("总开关关闭 和本地数据不一致  更新");
                    let canSendEntiry = {
                        "meiritixing":2
                        ,"xinzhipai":2
                        ,"shenhejieguo":2
                        ,"wanchengtixing":2
                    }
                    that.updateSendMsgNew(canSendEntiry);
                }
                return;
            }


            // 将要询问的模板集合
            var templateIdWillAsk = new Array();

            let hasItemSettings = subSetting.hasOwnProperty("itemSettings");
            if(hasItemSettings){
                // 用户有不再询问的设置  以不再询问的设置为准
                hasProp = subSetting.itemSettings.hasOwnProperty(templateId);
            }
            if(!hasProp){
                //console.info("用户没有设置任何不再询问,查询是否有拒绝历史")
                if(localUserInfo.canSend == 2){
                    //console.info("本地数据有拒绝历史,不再拉起")
                    return;
                }
                //console.info("本地数据没有拒绝历史, 查询最新数据")
                that.getUserInfo().then((res)=>{
                    if(res.code == 200){
                        let userInfo = res.data;
                        if(userInfo == '' || userInfo == null){
                            //console.info('找不到用户信息')
                            return;
                        }
                        if(userInfo.canSend == 0){
                            //console.info("最新数据没有拒绝历史,且当前订阅次数没有授权或已使用,询问")
                            that.askForSubAndUpdate(templateId);
                            return;
                        }else if(userInfo.canSend == 1){
                            //console.info('已同意,还未发送')
                        }else{
                            //console.info('最新数据已经拒绝')
                            wx.setStorage({
                              data: userInfo,
                              key: 'userInfo',
                            })
                        }
                    }
                   
                })
                return;
            }else{
                let tixing = subSetting.itemSettings[templateId];
                if(tixing == 'accept'){
                    //console.info("用户设置了接受不再询问,可以询问");
                    that.askForSubAndUpdate(templateId);
                    return;
                }
                if(tixing == 'reject' || tixing == 'ban' ){
                    if(localUserInfo.canSend != 2){
                       user.updateSendMsg(2);
                    }
                }
                return;
            }

        }        
        ,fail(res){
            //console.info("获取设置失败:"+res);
         }
    })
}

function checkSendMsgReal(templateId){
    let that = this;
    let localUserInfo = wx.getStorageSync('userInfo');
    wx.getSetting({
        withSubscriptions: true,
        success(settings){
            //console.info("获取设置成功");
            let subSetting = settings.subscriptionsSetting;
            //console.info(subSetting);
            wx.setStorage({
                data: settings,
                key: 'settings',
            })
            if(!subSetting.mainSwitch){
                //console.info("总开关关闭 不再询问");
                if(localUserInfo.canSend != 2){
                    that.updateSendMsg(2);
                }
                return;
            }
            let hasProp = subSetting.hasOwnProperty("itemSettings");
            if(hasProp){
                hasProp = subSetting.itemSettings.hasOwnProperty(templateId);
            }
            if(!hasProp){
                //console.info("用户没有设置任何不再询问,查询是否有拒绝历史")
                if(localUserInfo.canSend == 2){
                    //console.info("本地数据有拒绝历史,不再拉起")
                    return;
                }
                //console.info("本地数据没有拒绝历史, 查询最新数据")
                that.getUserInfo().then((res)=>{
                    if(res.code == 200){
                        let userInfo = res.data;
                        if(userInfo == '' || userInfo == null){
                            //console.info('找不到用户信息')
                            return;
                        }
                        if(userInfo.canSend == 0){
                            //console.info("最新数据没有拒绝历史,且当前订阅次数没有授权或已使用,询问")
                            that.askForSubAndUpdate(templateId);
                            return;
                        }else if(userInfo.canSend == 1){
                            //console.info('已同意,还未发送')
                        }else{
                            //console.info('最新数据已经拒绝')
                            wx.setStorage({
                              data: userInfo,
                              key: 'userInfo',
                            })
                        }
                    }
                   
                })
                return;
            }else{
                let tixing = subSetting.itemSettings[templateId];
                if(tixing == 'accept'){
                    //console.info("用户设置了接受不再询问,可以询问");
                    that.askForSubAndUpdate(templateId);
                    return;
                }
                if(tixing == 'reject' || tixing == 'ban' ){
                    if(localUserInfo.canSend != 2){
                       user.updateSendMsg(2);
                    }
                }
                return;
            }

        }        
        ,fail(res){
            //console.info("获取设置失败:"+res);
         }
    })
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
    return new Promise(function(resolve, reject) {
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
            util.checkSession().then(() => {
                resolve(true);
            }).catch(() => {
                reject(false);
            });

        } else {
            reject(false);
        }
    });
}

function refreshSetting(){
    let templateId = template.RENWUTIXING
    wx.getSetting({
        withSubscriptions: true,
        success(res){
            //console.info("获取设置成功");
            wx.setStorage({
                data: res,
                key: 'settings',
            })
        }        
        ,fail(res){
            //console.info("获取设置失败:"+res);
         }
    })
}

function authorizeInfo() {
    return new Promise(function(resolve, reject) {
        wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
                resolve({
                    authorizeInfo: true
                });
            },
            fail: function(err) {
                reject(err);
                return 2;
            }
        })
    })
}
module.exports = {
    loginByWeixin,
    checkLogin,
    getFamily,
    authorizeInfo,
    updateSendMsg,
    checkSendMsgReal,
    askForSubAndUpdate,
    getUserInfo,
    refreshSetting,
    refreshUserInfo
};