/**
 * Created by kingson·liu on 16/12/16.
 */
goceanApp.controller('MainCtrl', function ($scope,$rootScope, $state, $timeout, $stateParams) {

    $('.temp2').find('.temp22').click(function () {
        $(this).addClass('weui_active').siblings().removeClass('weui_active');
    });

    // 首页数据映射
    $rootScope.discoveryList = store.discovery.topicList;
    // 我的信息数据映射
    $rootScope.my = store.my;
});
