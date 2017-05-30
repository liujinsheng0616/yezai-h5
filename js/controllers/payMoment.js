/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.controller('PayMomentCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, payMomentService, qiusongDetailsSponsorService,configService, localStorageService) {
    console.log("about PayMomentCtrl");

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        localStorageService.set("passport",params);
    }

    $scope.passport = localStorageService.get("passport");

    var _state = "payment";//FIXME 登录后返回当前页面，需要参数skuId
    if ($scope.passport == null){//如果是基础用户，这里不要求授权用户信息; 若果没登录，就直接通过授权模式登录
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    function getDefaultAddress() {
        var tokenedRo = {
            passportId: $scope.passport.passportId,
            token: $scope.passport.token
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
            var day = plan.day;
            if (day == 1){
                plan.dayView = '日';
            } else if (day == 2){
                plan.day = '一';
            } else if (day == 3){
                plan.dayView = '二';
            } else if (day == 4){
                plan.dayView = '三';
            } else if (day == 5){
                plan.dayView = '四';
            } else if (day == 6){
                plan.dayView = '五';
            } else if (day == 7){
                plan.dayView = '六';
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

            var sharerId = 0;
            if ($stateParams.sharerId){
                sharerId = $stateParams.sharerId;
            }


            $rootScope.orderRo = {
                passportId:$scope.passport.passportId,
                token:$scope.passport.token,
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
                    buyerId:$scope.passport.passportId,
                    sharerId:sharerId,
                    invitorId:$scope.passport.invitorId
                },
                orderAddress:null,
                isPaid:false,
                pr:null
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
            if ($stateParams.isPaid) {
                $rootScope.orderRo.isPaid = $stateParams.isPaid;
            }

            if ($stateParams.crowdFundingId) {
                $rootScope.orderRo.crowdFundingId = $stateParams.crowdFundingId;
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
        if ($rootScope.defaultAddress){
            $rootScope.orderRo.addressId = $rootScope.defaultAddress.id;
        }
        if ($rootScope.orderRo.addressId == 0){
            alert("收货地址不能为空");
            return;
        }

        var obj = $rootScope.orderRo;
        obj.orderAddress = $rootScope.defaultAddress;

        if ($rootScope.orderRo.isPaid){
            qiusongDetailsSponsorService.qiusongSettle(obj).then(function (data) {
                if (data.status == "OK") {
                    var id = data.result;
                    if (orderRo.type == 'FORWARD_PLAN' || orderRo.type == 'FORWARD'){
                        $state.go('inServiceDetail', {orderId : orderId});
                    } else if (orderRo.type == 'NORMAL') {
                        $state.go('normalDetail', {orderId: orderId});
                    }

                } else {
                    alert("系统繁忙,请稍候再试");
                }
            },function(err){
                alert("系统繁忙,请稍候再试");
            });
        }else {

            payMomentService.placeOrder(obj).then(function (data) {
                if (data.status == "OK") {
                    var dto = data.result;
                    if (dto == null || dto == "undefined") {
                        alert("系统繁忙,请稍候再试");
                        return;
                    }

                    $state.go("orderDetail", {
                        orderId: dto.id
                    });
                } else {
                    alert("系统繁忙,请稍候再试");
                }
            },function(err){
                alert("系统繁忙,请稍候再试");
            });
        }
    };

    init();
});
