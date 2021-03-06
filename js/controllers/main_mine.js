/**
 * Created by kingson·liu on 2017/3/9.
 */
goceanApp.controller('MainMineCtrl', function ($scope,$rootScope, $state, $timeout, $stateParams,mainMineService,mineDetailService,configService, localStorageService) {

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = decodeURI(params.nickName);
        try {
            params.nickName = Base64.decode(params.nickName);
        }catch (e){
        }
        localStorageService.set("passport",params);
    }

    $scope.passport = localStorageService.get("passport");
    var _state = "mine";
    if ($scope.passport == null || $scope.passport.type == "BLANK"){
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();


    // 底部tab选中
    $("#mine").addClass("weui_active").siblings().removeClass('weui_active');

    if ($rootScope.my){
        $scope.my = $rootScope.my;
    }else {
        var obj = {a:1};
        mainMineService.getMyInfo(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }

    $scope.dealDetail = function () {
        $state.go("dealDetail");
    }

    // 初始化
    $scope.init = function () {
        var obj = {
            passportId : $scope.passport.passportId,
            token : $scope.passport.token
        };
        mineDetailService.mineDetailList(obj).then(function(data){
            if ("OK" == data.status) {
                $scope.mineData = data.result;
            }
        },function(err){

        });
    };

    $scope.init();
});