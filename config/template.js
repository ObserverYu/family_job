var RENWUTIXING;
var XINZHIPAI;
var SHENHEJIEGUO;
var WANCHENGTIXING;
var ALLTEMPLATE;

function setTemplate(allCode){
    this.RENWUTIXING = allCode.meiritixing;
    this.XINZHIPAI = allCode.xinzhipai;
    this.SHENHEJIEGUO = allCode.shenhejieguo;
    this.WANCHENGTIXING = allCode.wanchengtixing;
    this.ALLTEMPLATE = allCode.allList;
}

module.exports = {
    setTemplate,
    // 完成任务提醒
    RENWUTIXING,
    // 新的指派任务提醒
    XINZHIPAI,
    // 审核结果提醒
    SHENHEJIEGUO,
    // 完成提醒
    WANCHENGTIXING,
    // 全部模板id list
    ALLTEMPLATE
};