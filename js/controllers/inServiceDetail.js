/**
 * Created by 53983 on 2017/3/17.
 */
goceanApp.controller('InServiceDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, $filter, inServiceDetailService) {
    console.log("about InServiceDetailCtrl");

    var orderId = 0;
    if($stateParams.orderId){
        orderId = $stateParams.orderId;
    }
    var forwardList = null;
    if ( $rootScope.orderDetailsView){
        forwardList = $rootScope.orderDetailsView.forwardPlanDto.forwardList;
    }

    function init(orderDetailsDto){
        $rootScope.orderDetailsView = orderDetailsDto;
        forwardList = $rootScope.orderDetailsView.forwardPlanDto.forwardList;
        $rootScope.keyForward = forwardList[forwardList.length-1];
        $rootScope.orderDetailsView.keyIndex = parseInt((forwardList.length-1) / 4);
        $rootScope.defaultAddress = $rootScope.orderDetailsView.address;//rootScope和其他业务模块一致

        $rootScope.isDeliveryDayChanged = 0;
        $rootScope.isAddressChanged = 0;
    }

    $scope.resetPlan = function(index) {
        $rootScope.orderDetailsView.currentForwardList = [];
        var currentForwardList = $rootScope.orderDetailsView.currentForwardList;
        currentForwardList.push(forwardList[index * 4 + 0]);
        currentForwardList.push(forwardList[index * 4 + 1]);
        currentForwardList.push(forwardList[index * 4 + 2]);
        currentForwardList.push(forwardList[index * 4 + 3]);
    }

    function onReady(){

        var orderDetailsView = $rootScope.orderDetailsView;
        if (orderDetailsView.status == "ORDER_PAID"){
            orderDetailsView.statusView = "服务中";
        }else if (orderDetailsView.status == "ORDER_FINISHED"){
            orderDetailsView.statusView = "已完成";
        }

        var forwardPlanDto = orderDetailsView.forwardPlanDto;

        // 处理时间周期
        $rootScope.orderDetailsView.currentForwardList = [];
        // $scope.forwardList = forwardPlanDto.forwardList;
        // var forwardList = forwardPlanDto.forwardList;
        var currentLength = forwardList.length;//服务端发来的forwardList.size
        $rootScope.orderDetailsView.totalTimes = forwardPlanDto.forwardPlan.totalTimes;

        var totalTimes = $rootScope.orderDetailsView.totalTimes;
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


        $rootScope.orderDetailsView.index = $rootScope.orderDetailsView.keyIndex;
        $scope.resetPlan($rootScope.orderDetailsView.index);
    }

    function refresh(id) {
        if (id <= 0)
            return;
        var obj = {
            passportId:$rootScope.passport.passportId,
            token:$rootScope.passport.token,
            orderId:id};
        inServiceDetailService.getDetails(obj).then(function(data){
            console.log(data);
            if ("OK" == data.status){
                var orderDetailsDto = data.result;
                init(orderDetailsDto);
                onReady();
            }
        },function(err){

        });
    }



    // 右切换
    $scope.toRightPlan = function () {
        $rootScope.orderDetailsView.index += 1;
        $scope.resetPlan($rootScope.orderDetailsView.index);
    }


    // 左切换
    $scope.toLeftPlan = function(){
        $rootScope.orderDetailsView.index -= 1;
        $scope.resetPlan($rootScope.orderDetailsView.index);
    }

    // 查看服务详情
    $scope.toServiceDetail = function (forward) {
        if (forward.status == 'BLANK'){
            return;
        }
        $state.go('deliveryDetail', {orderId:forward.orderId});
    }

    // 切换收货地址界面
    $scope.toAddress = function () {
        if ($rootScope.orderDetailsView.status == 'ORDER_FINISHED'){
            return;
        }
        $state.go('address')
    }

    function changeDeliveryDay(){
        if ($rootScope.isDeliveryDayChanged == 0)
            return;

        var obj = {
            passportId: $rootScope.passport.passportId,
            token: $rootScope.passport.token,
            orderId: $rootScope.orderDetailsView.id,
            day: $rootScope.deliveryDayChanged.day,
            time: $rootScope.deliveryDayChanged.time
        }

        inServiceDetailService.changeDeliveryDay(obj).then(function(data){
            console.log(data);
            $rootScope.isDeliveryDayChanged = 0;

            refresh($rootScope.orderDetailsView.id);

        },function(err){
            $rootScope.isDeliveryDayChanged = 0;
        });

    }

    function changeAddress(){
        if ($rootScope.isAddressChanged == 0)
            return;

        var obj = $rootScope.defaultAddress;
        obj.passportId = $rootScope.passport.passportId;
        obj.token = $rootScope.passport.token;
        obj.pr = $rootScope.orderDetailsView.pr;
        obj.orderId = $rootScope.orderDetailsView.orderId;

        inServiceDetailService.changeOrderAddress(obj).then(function(data){
            console.log(data);
            $rootScope.isAddressChanged = 0;
            $rootScope.deliveryDayChanged = null;
        },function(err){
            $rootScope.isAddressChanged = 0;
            $rootScope.deliveryDayChanged = null;
        });

    }

    if (! $rootScope.orderDetailsView) {
        refresh(orderId);
        return;
    }else if ($rootScope.orderDetailsView.isInited == false){
        $rootScope.orderDetailsView.isInited == true;
        init($rootScope.orderDetailsView);
        onReady();
        return;
    }

    changeDeliveryDay();
    changeAddress();

});
