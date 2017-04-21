/**
 * Created by 53983 on 2017/3/14.
 */
var totalPrice=0;
var price=0;
goceanApp.controller('PayMomentCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, payMomentService) {
    console.log("about PayMomentCtrl");

    // 参数里拿值
    if ($stateParams.title){
        $rootScope.title = $stateParams.title;
    }
    if ($stateParams.payDescription){
        $rootScope.payDescription = $stateParams.payDescription;
    }
    if ($stateParams.price){
        $rootScope.price = $stateParams.price;
    }
    if ($stateParams.thumbnail){
        $rootScope.thumbnail = $stateParams.thumbnail;
    }
    if ($stateParams.payAttachment){//FIXME 页面商品下面加一栏，参考花+
        $rootScope.payAttachment = $stateParams.payAttachment;
    }
    if ($stateParams.type){
    	$rootScope.orderType = $stateParams.type;
    }
    
    // 加价
    totalPrice = $rootScope.price;
    price = $rootScope.price;
    $rootScope.totalPrice = $rootScope.price;

    /*
     * 获取默认地址
     */
    var tokenedRo = {
        passportId: $rootScope.passport.passportId,
        token:$rootScope.passport.token
    };
    payMomentService.getDefaultAddress(tokenedRo).then(function(data){
        if (data.status == "OK") {
            $rootScope.defaultAddress = data.result;
        }
    });

    if ($rootScope.defaultAddress == null) {
        $rootScope.defaultAddress = store.defaultAddress;
    }

 
    // 配送周期
    $scope.getForwordPLanSelector = function () {
    	
    	if ($rootScope.orderType != "FORWARD") 
   	 		return;
        // service 拿取送货计划
        $scope.forwardPlanList = [];

        var obj = {
            goodsId:$stateParams.goodsId
        };
        payMomentService.getForwardPlanSelector(obj).then(function(data){
            if (data.status == "OK") {
                $scope.forwardPlanList = data.result;

                initPlanSelector();
            }
        });

    };

    function initPlanSelector() {
        for (var i = 0;i<$scope.forwardPlanList.length;i++){
            var plan = $scope.forwardPlanList[i];
            var dayOfWeek = plan.dayOfWeek;
            if (dayOfWeek == 1){
                plan.day = '日';
            } else if (dayOfWeek == 2){
                plan.day = '一';
            } else if (dayOfWeek == 3){
                plan.day = '二';
            } else if (dayOfWeek == 4){
                plan.day = '三';
            } else if (dayOfWeek == 5){
                plan.day = '四';
            } else if (dayOfWeek == 6){
                plan.day = '五';
            } else if (dayOfWeek == 7){
                plan.day = '六';
            }

        }
        $scope.planList = [];
        $scope.planList.push($scope.forwardPlanList[0]);
        $scope.planList.push($scope.forwardPlanList[1]);
        $scope.leftIndex = 0;
        $scope.rightIndex = 1;
    }

    $scope.getForwordPLanSelector();

    
    // 改变首次送达时间
    $scope.changeFirstPlanTime = function (index) {
   	 	if ($rootScope.orderType != "FORWARD") 
   	 		return;
        $("#plan"+index).removeClass().addClass("forwordPlanFirst");
        $("#temp"+index).removeClass().addClass("forwordPlan_tempd");
        if (index == 0){
            $("#plan1").removeClass().addClass("forwordPlan");
            $("#temp1").removeClass().addClass("forwordPlan_tempc");
        } else {
            $("#plan0").removeClass().addClass("forwordPlan");
            $("#temp0").removeClass().addClass("forwordPlan_tempc");
        }
    };

    // 右点击滑动切换
    $scope.toRight = function (rightIndex) {
    	if ($rootScope.orderType != "FORWARD") 
   	 		return;
        $scope.planList=[];
        $scope.planList.push($scope.forwardPlanList[rightIndex+1]);
        $scope.planList.push($scope.forwardPlanList[rightIndex+2]);
        $scope.leftIndex = rightIndex+1;
        $scope.rightIndex = rightIndex+2;
        $("#plan0").removeClass().addClass("forwordPlanFirst");
        $("#temp0").removeClass().addClass("forwordPlan_tempd");
        $("#plan1").removeClass().addClass("forwordPlan");
        $("#temp1").removeClass().addClass("forwordPlan_tempc");
    };

    // 左点击滑动切换
    $scope.toLeft = function (leftIndex) {
    	if ($rootScope.orderType != "FORWARD") 
   	 		return;
        $scope.planList=[];
        $scope.planList.push($scope.forwardPlanList[leftIndex-2]);
        $scope.planList.push($scope.forwardPlanList[leftIndex-1]);
        $scope.leftIndex = leftIndex-2;
        $scope.rightIndex = leftIndex-1;
        $("#plan0").removeClass().addClass("forwordPlanFirst");
        $("#temp0").removeClass().addClass("forwordPlan_tempd");
        $("#plan1").removeClass().addClass("forwordPlan");
        $("#temp1").removeClass().addClass("forwordPlan_tempc");
    }


});
// 加价合计
function addPrice(obj) {
    totalPrice = price;
    if (obj != ''){
        totalPrice +=parseFloat(obj);
    }
    $("#totalPrice").html(totalPrice.toFixed(2))
}
