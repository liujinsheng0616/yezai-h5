/**
 * Created by 53983 on 2017/3/17.
 */
goceanApp.controller('InServiceDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, $filter, inServiceDetailService) {
    console.log("about InServiceDetailCtrl");

    if ($stateParams.orderDetailsDto){
        $rootScope.orderDetailsView = $stateParams.orderDetailsDto;
    }else{
        return;
    }

    var forwardPlanDto = $scope.orderDetailsView.forwardPlanDto;
    // var day= plan.day;
    // if (day == 1){
    //    plan.dayView = '日';
    // } else if (dayOfWeek == 2){
    //     plan.dayView = '一';
    // } else if (dayOfWeek == 3){
    //     plan.dayView = '二';
    // } else if (dayOfWeek == 4){
    //     plan.dayView = '三';
    // } else if (dayOfWeek == 5){
    //     plan.dayView = '四';
    // } else if (dayOfWeek == 6){
    //     plan.dayView = '五';
    // } else if (dayOfWeek == 7){
    //     plan.dayView = '六';
    // }

    $rootScope.defaultAddress = $rootScope.orderDetailsView.address;

    // 处理时间周期
    $scope.currentForwardList = [];
    $scope.forwardList = forwardPlanDto.forwardList;
    var forwardList = forwardPlanDto.forwardList;
    var currentLength = $scope.forwardList.length;//服务端发来的forwardList.size
    var totalTimes = forwardPlanDto.forwardPlan.totalTimes;

    $scope.leftIndex = 0;
    $scope.rightIndex = 3;
    var forward = forwardList[totalTimes-1];
    var deliveryTime = forward.deliveryTime;
    const ONE_WEEK = 604800000;
    for (var i = 1; i <= totalTimes - currentLength; i++){//补齐服务端没发送的
        // Forward.java
        // private long orderId;
        // private String status;
        // private long deliveryTime;
        var plan = {
            orderId:0,
            status:'BLANK',
            deliveryTime:deliveryTime + ONE_WEEK * i
        };
        forwardList.push(plan);
    }
    $scope.currentForwardList.push(forwardList[0]);
    $scope.currentForwardList.push(forwardList[1]);
    $scope.currentForwardList.push(forwardList[2]);
    $scope.currentForwardList.push(forwardList[3]);

    // 右切换
    $scope.toRightPlan = function (index) {
        $scope.currentForwardList = [];
        $scope.currentForwardList.push(forwardList[index+1]);
        $scope.currentForwardList.push(forwardList[index+2]);
        $scope.currentForwardList.push(forwardList[index+3]);
        $scope.currentForwardList.push(forwardList[index+4]);
        $scope.leftIndex = index + 1;
        $scope.rightIndex = index + 4;
    }

    // 左切换
    $scope.toLeftPlan = function(index){
        $scope.currentForwardList = [];
        $scope.currentForwardList.push(forwardList[index-4]);
        $scope.currentForwardList.push(forwardList[index-3]);
        $scope.currentForwardList.push(forwardList[index-2]);
        $scope.currentForwardList.push(forwardList[index-1]);
        $scope.leftIndex = index-4;
        $scope.rightIndex = index-1;
    }

    // 查看服务详情
    $scope.toServiceDetail = function (orderId,forwardId,status) {
        if (status == 'BLANK'){
            return;
        }
        $state.go('deliveryDetail', {orderId:orderId,forwardId:forwardId,status:$rootScope.status});
    }

    // 切换收货地址界面
    $scope.toAddress = function () {
        if ($rootScope.status == '已完成'){
            return;
        }
        $state.go('address')
    }
});
