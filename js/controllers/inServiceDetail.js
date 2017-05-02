/**
 * Created by 53983 on 2017/3/17.
 */
goceanApp.controller('InServiceDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, $filter, inServiceDetailService) {
    console.log("about InServiceDetailCtrl");


    if ($stateParams.orderDetailsDto){
        $rootScope.orderDetailsView = $stateParams.orderDetailsDto;
        var forwardList = $rootScope.orderDetailsView.forwardPlanDto.forwardList;
        $rootScope.keyForward = forwardList[forwardList.length-1];
        $rootScope.keyIndex = (forwardList.length-1) / 4;
        $rootScope.defaultAddress = $rootScope.orderDetailsView.address;//rootScope和其他业务模块一致
    }else{
        if (! $rootScope.orderDetailsView) {
            return;
        }
    }

    var orderDetailsView = $rootScope.orderDetailsView;
    if (orderDetailsView.status == "ORDER_PAID"){
        orderDetailsView.statusView = "服务中";
    }else if (orderDetailsView.status == "ORDER_FINISHED"){
        orderDetailsView.statusView = "已完成";
    }

    var forwardPlanDto = orderDetailsView.forwardPlanDto;



    // 处理时间周期
    $scope.currentForwardList = [];
    $scope.forwardList = forwardPlanDto.forwardList;
    $scope.template = forwardPlanDto.template;
    var forwardList = forwardPlanDto.forwardList;
    var currentLength = $scope.forwardList.length;//服务端发来的forwardList.size
    $scope.totalTimes = forwardPlanDto.forwardPlan.totalTimes;

    var totalTimes = $scope.totalTimes;
    var deliveryTime = $rootScope.keyForward.deliveryTime;
    const ONE_WEEK = 604800000;

    var id = 1;
    for (i in forwardList){
        var forward = forwardList[i];
        forward.id = id++;
    }

    for (var i = 1; i <= totalTimes - currentLength; i++){//补齐服务端没发送的
        // Forward.java
        // private long orderId;
        // private String status;
        // private long deliveryTime;
        var plan = {
            id: id++,
            orderId:0,
            status:'BLANK',
            deliveryTime:deliveryTime + ONE_WEEK * i
        };
        forwardList.push(plan);
    }

    $scope.resetPlan = function(index) {
        $scope.currentForwardList = [];
        $scope.currentForwardList.push(forwardList[index * 4 + 0]);
        $scope.currentForwardList.push(forwardList[index * 4 + 1]);
        $scope.currentForwardList.push(forwardList[index * 4 + 2]);
        $scope.currentForwardList.push(forwardList[index * 4 + 3]);
    }
    $scope.index = $rootScope.keyIndex;
    $scope.resetPlan($scope.index);
    // 右切换
    $scope.toRightPlan = function () {
        $scope.index += 1;
        $scope.resetPlan($scope.index);
    }

    // 左切换
    $scope.toLeftPlan = function(){
        $scope.index -= 1;
        $scope.resetPlan($scope.index);
    }

    // 查看服务详情
    $scope.toServiceDetail = function (orderId,forward) {
        if (forward.status == 'BLANK'){
            return;
        }
        $state.go('deliveryDetail', {orderId:orderId,forwardId:forward.orderId,status:$rootScope.status});
    }

    // 切换收货地址界面
    $scope.toAddress = function () {
        if ($rootScope.orderDetailsView.status == 'ORDER_FINISHED'){
            return;
        }
        $state.go('address')
    }
});
