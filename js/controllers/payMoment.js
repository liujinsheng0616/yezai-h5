/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.controller('PayMomentCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, payMomentService) {
    console.log("about PayMomentCtrl");

    var _state = "mall";
    if ($rootScope.passport == null){
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state="+_state;
        return;
    }

    function getDefaultAddress() {
        var tokenedRo = {
            passportId: $rootScope.passport.passportId,
            token: $rootScope.passport.token
        };
        payMomentService.getDefaultAddress(tokenedRo).then(function (data) {
            if (data.status == "OK") {
                $rootScope.defaultAddress = data.result;
                $rootScope.orderRo.addressId = data.result.id;
            }
        });
    };

    // 配送周期
    function getForwordPLanSelector () {

        if ($rootScope.orderRo.type != "FORWARD")
            return;
        // service 拿取送货计划
        $rootScope.forwardPlanList = [];

        var obj = {
            goodsId:$stateParams.goodsId
        };
        payMomentService.getForwardPlanSelector(obj).then(function(data){
            if (data.status == "OK") {
                $rootScope.forwardPlanList = data.result;

                initPlanSelector();
            }
        });

    };


    function initPlanSelector() {
        for (var i = 0;i<$rootScope.forwardPlanList.length;i++){
            var plan = $rootScope.forwardPlanList[i];
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
        $rootScope.planList = [];
        $rootScope.planList.push($rootScope.forwardPlanList[0]);
        $rootScope.planList.push($rootScope.forwardPlanList[1]);
        $rootScope.leftIndex = 0;
        $rootScope.rightIndex = 1;

        $rootScope.orderRo.plan = $rootScope.forwardPlanList[0];
    };


    function init () {

        if ($rootScope.orderRo == null) {

            $rootScope.orderRo = {
                passportId:$rootScope.passport.passportId,
                token:$rootScope.passport.token,
                skuId: $stateParams.skuId,
                pricePlus: null,
                qty:1,
                addressId:0,
                plan: null,
                note: null,
                type: null,
                payDescription:null,
                thumbnail:null,
                attachmentIdList:[],
                orderUsers:{
                    buyerId:$rootScope.passport.passportId,
                    sharerId:0,
                    invitorId:0
                },
                orderAddress:null
            };

            $rootScope.payView = {
                title:null,
                attachment:null
            };

            // 参数里拿值
            if ($stateParams.title) {
                $rootScope.payView.title = $stateParams.title;
            }
            if ($stateParams.payDescription) {
                $rootScope.orderRo.payDescription = $stateParams.payDescription;
            }
            if ($stateParams.price) {
                $rootScope.orderRo.price = $stateParams.price;
            }
            if ($stateParams.thumbnail) {
                $rootScope.orderRo.thumbnail = $stateParams.thumbnail;
            }
            if ($stateParams.payAttachment) {//FIXME 页面商品下面加一栏，参考花+
                $rootScope.payView.attachment = $stateParams.payAttachment;
            }
            if ($stateParams.type) {
                $rootScope.orderRo.type = $stateParams.type;
            }

            if ($rootScope.attachment != null){
                for (i in $rootScope.attachment){
                    $rootScope.orderRo.attachmentIdList[i] = $rootScope.attachment[i].skuId;
                }
            }

            /*
             * 获取默认地址
             */
            getDefaultAddress();

            if ($rootScope.defaultAddress == null) {
                $rootScope.defaultAddress = store.defaultAddress;
            }

            getForwordPLanSelector();
        }else{
            if($rootScope.orderRo.type == "FORWARD") {
                $rootScope.orderRo.plan = $rootScope.forwardPlanList[0];
            }
        }

    };


    // 改变首次送达时间
    $scope.changeFirstPlanTime = function (index) {
   	 	if ($rootScope.orderRo.type != "FORWARD")
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
        $rootScope.orderRo.plan = $rootScope.forwardPlanList[index];
    };

    // 右点击滑动切换
    $scope.toRight = function (rightIndex) {
    	if ($rootScope.orderRo.type != "FORWARD")
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
    	if ($rootScope.orderRo.type != "FORWARD")
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
    };

    $scope.placeOrder = function () {
        if ($rootScope.orderRo.addressId == 0){
            alert("收货地址不能为空");
            return;
        }
        var obj = $rootScope.orderRo;
        obj.orderAddress = $rootScope.defaultAddress;
        payMomentService.placeOrder(obj).then(function(data){
            if (data.status == "OK") {
                var dto = data.result;
                if (dto == null || dto == "undefined"){
                    alert("系统繁忙,请稍候再试");
                    return;
                }
                $state.go("orderDetail", {
                    orderDetailsDto:dto
                });
            }else{
                alert("系统繁忙,请稍候再试");
            }
        }).error(function (data) {
            alert("系统繁忙,请稍候再试!");
        });
    };

    init();
});
