function printJobHook(inputs, actions) {
  var pageLimit = 10;
  var maxMins = 5;
  if (!inputs.job.isAnalysisComplete) {
    return;
  };
  
  var date = new Date(inputs.job.date);
  var YYYY = date.getFullYear();
  var MM = date.getMonth() + 1;
  var DD = date.getDate();
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();
  var currentPage = inputs.user.getNumberProperty("page");
  var lastTime1 = inputs.user.getProperty("lastTime");
  var lastTime2 = new Date(lastTime1);
  var elapsedTime = date - lastTime2;
  
  if (isNaN(elapsedTime)) {
    actions.log.info("NaN判定");
    lastTime2 = date;
    elapsedTime = date - lastTime2;
    currentPage = null;
    lastTime1 = YYYY + "/" + MM + "/" + DD + "/" + hh + ":" + mm + ":" + ss;
  };
  var mins = Math.trunc(elapsedTime / 60000);
  if (mins > maxMins) {
    actions.log.info("時間経過、リセット");
    currentPage = null;
    lastTime1 = YYYY + "/" + MM + "/" + DD + "/" + hh + ":" + mm + ":" + ss;
    mins = 0;
  };
  
  if (currentPage == null) {
    currentPage == 0;
  };
  
  currentPage += inputs.job.totalColorPages;
  actions.log.info("前回時刻:" + new Date(lastTime1));
  actions.log.info("今回時刻:" + date);
  actions.log.info("差分(分):" + mins);
  actions.log.info("ページ数:" + currentPage);
  
  if (currentPage > pageLimit || (currentPage > pageLimit && mins < maxMins)) {
    actions.job.cancelAndLog(mins + "分以内に" + currentPage + "ページの印刷が行われました。" +
                             maxMins + "分以内に" + pageLimit + "ページ以上の印刷は行わないでください。");
  };
  actions.user.onCompletionSaveProperty("lastTime", lastTime1, {
    'saveWhenCancelled': true
  });
  actions.user.onCompletionSaveProperty("page", currentPage, {
    'saveWhenCancelled': true
  });
};



​