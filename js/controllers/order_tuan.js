/**
 * Created by kingson·liu on 17/3/8.
 */
goceanApp.controller('OrderTuanCtrl', function ($scope, $state, $timeout, $stateParams, configService) {

    // 底部tab选中
    $("#tuan").addClass("weui_active").siblings().removeClass('weui_active');

    // 隐藏右上角
    setTimeout(function(){
        configService.hideWXBtn();
    },100);
});