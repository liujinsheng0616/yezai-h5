/**
 * Created by 53983 on 2017/5/27.
 */
goceanApp.controller('DealDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, dealDetailService, configService) {
    console.log('about DealDetailCtrl');

    document.title='也在-交易明细';

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    // 初始化
    $scope.init =function () {
        var obj = {
            passportId : $stateParams.passportId,
            token : $stateParams.token
        };
        dealDetailService.dealDetailList(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }();

});