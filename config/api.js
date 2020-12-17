//const ApiRootUrl = 'http://localhost:9410/';
const ApiRootUrl = 'https://family.lovejiangbaby.cn/';

module.exports = {
    // 个人
    AuthLoginByWeixin: ApiRootUrl + 'user/loginByWeixin', //微信登录
    GetUsers: ApiRootUrl + 'user/userList',
    GetUserDetail:ApiRootUrl + 'user/userDetail',
    FreshSendMsg:ApiRootUrl + 'user/freshSendMsg',
    HomePageInfo:ApiRootUrl + 'user/homePageInfo',
    GetMyUserInfo:ApiRootUrl + 'user/getMyUserInfo',
    // 家务
    JobCountInfo: ApiRootUrl + 'job/jobCount', // 我的页面获取家务数据
    ListAllJobType: ApiRootUrl + 'job/listAllType', //所有家务类别
    ListJobByType: ApiRootUrl + 'job/listJobInfoByType', // 家务列表
    ListAllJobTypeAndInfo: ApiRootUrl + 'job/listAllTypeAndInfo', // 所有家务类别和信息列表
    CreateJobToUser: ApiRootUrl + 'job/createJobToUser', // 创建
    ListMyJob: ApiRootUrl + 'job/listMyJob', // 我的家务列表
    JobUserDetail: ApiRootUrl + 'job/getJobUserDetail', // 家务详情
    AcceptJobUser: ApiRootUrl + 'job/acceptJob', // 接受任务
    RefuseJobUser: ApiRootUrl + 'job/refuseJob', // 拒绝任务
    FinishJobUser: ApiRootUrl + 'job/finishJob', // 完成任务
    
    // 家庭
    CreateFamily:ApiRootUrl + 'family/createFamily',
    GetFamily:ApiRootUrl + 'family/getFamily',
    GetMyInviteRecord:ApiRootUrl + 'invite/getMyInviteRecord', // 查看是否有邀请
    InviteUser:ApiRootUrl + 'invite/inviteUser', //邀请用户
    AcceptInvite:ApiRootUrl + 'invite/acceptInvite', //接受邀请
    RefuseInvite:ApiRootUrl + 'invite/refuseInvite', //拒绝邀请
    DeleteMember:ApiRootUrl + 'family/deleteMember', //移出家庭

    // 定时家务
    ListFamilyCronJob:ApiRootUrl + 'cron-job/listFamilyCronJob', //定时列表
    CreateCronJob:ApiRootUrl + 'cron-job/createCronJob', //创建定时任务
    CronJobDetail:ApiRootUrl + 'cron-job/cronJobDetail', //定时任务详情
    CloseCronJob:ApiRootUrl + 'cron-job/closeCronJob', //关闭定时任务
    OpenCronJob:ApiRootUrl + 'cron-job/openCronJob', //打开定时任务
    DeleteCronJob:ApiRootUrl + 'cron-job/deleteCronJob', //删除定时任务  
};