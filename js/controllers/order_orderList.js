/**
 * Created by Kingson·liu on 17/3/8.
 */
goceanApp.controller('OrderListCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams,orderListService) {

    // 底部tab选中
    $("#order").addClass("weui_active").siblings().removeClass('weui_active');
    $('#tab1').tab({defaultIndex:0,activeClass:"tab-green"});

    var allType = 'ALL';
    //请求参数
    // 全部数据
    $scope.getAllOrderList = function(status){
        var obj = {status:status};
        if ($rootScope.orderListView){
            $scope.orderList = $rootScope.orderListView.list;
            for (var i = 0; i < $scope.orderList.length; i++){
                var order = $scope.orderList[i];
                order.createTime = order.createTime.substring(0, 10);
                if (order.status == 'ORDER_CREATED'){
                    order.status = '未付款';
                } else if (order.status == 'ORDER_PAID'){
                    order.status = '服务中';
                } else if (order.status == 'ORDER_FINISHED'){
                    order.status = '已完成';
                }
            }
            if(!$scope.$$phase){
                $scope.$apply();
            }
        } else {
            orderListService.getOrderListByType(obj).then(function(data){
                console.log(data);
            },function(err){

            });
        }
    };
    // 页面刷新加载
    $scope.getAllOrderList(allType);

    // 未付款
    $scope.getNoPayOrderList = function(status){
        var obj = {status:status};
        if ($rootScope.orderListNoPayView){
            $scope.orderList = $rootScope.orderListNoPayView.list;
            for (var i = 0; i < $scope.orderList.length; i++){
                var order = $scope.orderList[i];
                order.createTime = order.createTime.substring(0, 10);
                order.status = '未付款';
            }
            if(!$scope.$$phase){
                $scope.$apply();
            }
        } else {
            orderListService.getOrderListByType(obj).then(function(data){
                console.log(data);
            },function(err){

            });
        }
    };

    // 服务中
    $scope.getInServiceOrderList = function(status){
        var obj = {status:status};
        if ($rootScope.orderListInServiceView){
            $scope.orderList = $rootScope.orderListInServiceView.list;
            for (var i = 0; i < $scope.orderList.length; i++){
                var order = $scope.orderList[i];
                order.createTime = order.createTime.substring(0, 10);
                order.status = '服务中';
            }
            if(!$scope.$$phase){
                $scope.$apply();
            }
        } else {
            orderListService.getOrderListByType(obj).then(function(data){
                console.log(data);
            },function(err){

            });
        }
    };

    // 已完成
    $scope.getCompletedOrderList = function(status){
        var obj = {status:status};
        if ($rootScope.orderListCompletedView){
            $scope.orderList = $rootScope.orderListCompletedView.list;
            for (var i = 0; i < $scope.orderList.length; i++){
                var order = $scope.orderList[i];
                order.createTime = order.createTime.substring(0, 10);
                order.status = '已完成';
            }
            if(!$scope.$$phase){
                $scope.$apply();
            }
        } else {
            orderListService.getOrderListByType(obj).then(function(data){
                console.log(data);
            },function(err){

            });
        }
    }

    // 跳转详情页
    $scope.goToOrderDetail = function (status,type) {
        if (status == '服务中' || status == '已完成'){
            if (type == 'FORWARD'){
                $state.go('inServiceDetail', {status : status});
            } else if (type == 'NORMAL')
                $state.go('normalDetail');
            $rootScope.status = status;
        } else if (status == "未付款"){
            $state.go('orderDetail');
        }
    }
});