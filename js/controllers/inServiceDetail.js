/**
 * Created by 53983 on 2017/3/17.
 */
goceanApp.controller('InServiceDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, $filter, inServiceDetailService) {
    console.log("about InServiceDetailCtrl");

    if (!$rootScope.status){
        $rootScope.status=$stateParams.status;
    }
    // 数据绑定
    var obj = {orderId : 1};
    inServiceDetailService.getServiceOrderDetail(obj).then(function(data){
        console.log(data);
    },function(err){

    });

    // service里处理
    $scope.serviceOrderDetail = store.orderDetails;
    var dayOfWeek= $scope.serviceOrderDetail.forwardPlan.dayOfWeek;
    if (dayOfWeek == 1){
        $scope.serviceOrderDetail.forwardPlan.day = '日';
    } else if (dayOfWeek == 2){
        $scope.serviceOrderDetail.forwardPlan.day = '一';
    } else if (dayOfWeek == 3){
        $scope.serviceOrderDetail.forwardPlan.day = '二';
    } else if (dayOfWeek == 4){
        $scope.serviceOrderDetail.forwardPlan.day = '三';
    } else if (dayOfWeek == 5){
        $scope.serviceOrderDetail.forwardPlan.day = '四';
    } else if (dayOfWeek == 6){
        $scope.serviceOrderDetail.forwardPlan.day = '五';
    } else if (dayOfWeek == 7){
        $scope.serviceOrderDetail.forwardPlan.day = '六';
    }
    if ($rootScope.defaultAddress){
        $scope.defaultAddress = $rootScope.defaultAddress;
    }else{
        $scope.defaultAddress = $scope.serviceOrderDetail.address;
    }

    // 处理时间周期
    $scope.thisForwardPlanList = [];
    $scope.planList = $scope.serviceOrderDetail.forwardPlan.forwardList;
    var currentLength = $scope.planList.length;
    var changLength = parseInt($scope.serviceOrderDetail.forwardPlan.times) * parseInt($scope.serviceOrderDetail.forwardPlan.month);
    if ($rootScope.nextDeliveryDay){
        $scope.nextDeliveryDay = $rootScope.nextDeliveryDay;
    } else {
        $scope.nextDeliveryDay = $scope.serviceOrderDetail.forwardPlan.nextDeliveryDay;
    }
    $scope.leftIndex = 0;
    $scope.rightIndex = 3;
    for (var i = 0; i < changLength - currentLength; i++){
        var plan = {};
        plan.status = 'BLANK';
        // 时间往后推7天
        var newDeliveryDay = $filter('date')(new Date(new Date($scope.nextDeliveryDay).getTime() + 24*7*60*60*1000),'yyyy-MM-dd');
        plan.nextDeliveryDay = newDeliveryDay;
        $scope.planList.push(plan);
        $scope.nextDeliveryDay = newDeliveryDay;
    }
    $scope.thisForwardPlanList.push($scope.planList[0]);
    $scope.thisForwardPlanList.push($scope.planList[1]);
    $scope.thisForwardPlanList.push($scope.planList[2]);
    $scope.thisForwardPlanList.push($scope.planList[3]);

    // 右切换
    $scope.toRightPlan = function (index) {
        $scope.thisForwardPlanList = [];
        $scope.thisForwardPlanList.push($scope.planList[index+1]);
        $scope.thisForwardPlanList.push($scope.planList[index+2]);
        $scope.thisForwardPlanList.push($scope.planList[index+3]);
        $scope.thisForwardPlanList.push($scope.planList[index+4]);
        $scope.leftIndex = index + 1;
        $scope.rightIndex = index + 4;
    }

    // 左切换
    $scope.toLeftPlan = function(index){
        $scope.thisForwardPlanList = [];
        $scope.thisForwardPlanList.push($scope.planList[index-4]);
        $scope.thisForwardPlanList.push($scope.planList[index-3]);
        $scope.thisForwardPlanList.push($scope.planList[index-2]);
        $scope.thisForwardPlanList.push($scope.planList[index-1]);
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
