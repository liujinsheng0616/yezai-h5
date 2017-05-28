/**
 * Created by 53983 on 2017/5/27.
 */
goceanApp.controller('MineDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, dealDetailService, configService) {
    console.log('about MineDetailCtrl');

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();
});