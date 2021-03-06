/**
 * Created by 53983 on 2017/5/27.
 */
goceanApp.controller('MineDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, mineDetailService, configService) {
    console.log('about MineDetailCtrl');

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    // 初始化
    $scope.init = function () {
        var obj = {
            passportId : $stateParams.passportId,
            token : $stateParams.token
        };
        mineDetailService.mineDetailList(obj).then(function(data){
            if ("OK" == data.status) {
                $scope.mineData = data.result;
            }
        },function(err){

        });
    };

    $scope.draw = function () {

        $.alert("系统在48小时内处理");
        var obj = {
            passportId : $stateParams.passportId,
            token : $stateParams.token
        };
        mineDetailService.draw(obj).then(function(data){
            if ("OK" == data.status) {
                window.location.reload();
            }
        },function(err){

        });
    }

    $scope.init();
});