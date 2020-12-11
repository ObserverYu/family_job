const ApiRootUrl = 'http://localhost:9410/';
//const ApiRootUrl = 'https://www.hiolabs.com/api/';

module.exports = {
    // 个人
    AuthLoginByWeixin: ApiRootUrl + 'user/loginByWeixin', //微信登录
    GetUsers: ApiRootUrl + 'user/userList',
    GetUserDetail:ApiRootUrl + 'user/userDetail',
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
};