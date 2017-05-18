/**
 * Created by 53983 on 2017/5/16.
 */
goceanApp.controller('QiusongSharedCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, qiusongSharedService, configService, appSettings, mainHomeService) {
    console.log("about QiusongSharedCtrl");
    // 页面传参
    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        $rootScope.passport = params;
    }

    var id = 0;
    var sharerId = 0;
    if ($stateParams.id){
        id = $stateParams.id;
    }
    if ($stateParams.sharerId){
        sharerId = $stateParams.sharerId;
    }
    $scope.userFlag = false;
    if ($rootScope.passport.passportId == sharerId){
        $scope.userFlag = true;
    }

    var _state = "qiusongShared";//FIXME ，需要参数sponsorId
    if ($rootScope.passport == null){//如果是基础用户，这里不要求授权用户信息; 若果没登录，就直接通过授权模式登录
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632" +
            "&redirect_uri=http://wxsdk.yezaigou.com/wx/page/qiusong" +
            "/" + id + "/"+sharerId +
            "&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }
    //再分享
    var sharedUrl = appSettings.domain + "/#/qiusongShared/"+id +"/"+$rootScope.passport.passportId;

    // 初始化
    init();
    function init() {
        var obj = {
            passportId: $rootScope.passport.passportId,
            token : $rootScope.passport.token,
            crowdFundingId : id
        };
        qiusongSharedService.getDetails(obj).then(function(data){
            if (data.status == "OK") {
                $scope.qiusong = data.result;
                $scope.qiusong.sponsorName = Base64.decode($scope.qiusong.sponsorName);
                console.log($scope.qiusong)
            }else{
                $.alert("系统繁忙,请稍候再试");
            }
        },function(err){

        });
    }

    // 购买页
    $scope.toQiusong = function() {
        $state.go("qiusongEntry", {
            itemId:$scope.qiusong.itemId
        })
    }
});