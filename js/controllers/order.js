/**
 * Created by kingson·liu on 16/12/16.
 */
goceanApp.controller('OrderCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams) {

    $('.temp2').find('.temp22').click(function () {
        $(this).addClass('weui_active').siblings().removeClass('weui_active');
    });
    // 订单列表全局映射
    $rootScope.orderListView = store.orderListView;
    $rootScope.orderListNoPayView  = store.orderListNoPayView;
    $rootScope.orderListInServiceView = store.orderListInServiceView;
    $rootScope.orderListCompletedView = store.orderListCompletedView;
});
