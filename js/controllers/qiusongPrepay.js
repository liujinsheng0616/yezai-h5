/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.controller('QiusongPrepayCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams) {
    console.log("about QiusongPrepayCtrl");
    var _state = "qiusongPay/" + $stateParams.qiusongId + "/" + $stateParams.memberId;
    window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state=" + _state;
});