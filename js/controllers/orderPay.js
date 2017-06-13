/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.controller('OrderPayCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, orderDetailService, configService, localStorageService) {
    console.log("about OrderPayCtrl");

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = decodeURI(params.nickName);
        try {
            params.nickName = Base64.decode(params.nickName);
        }catch (e){
        }
        localStorageService.set("passport",params);
    }

    $scope.passport = localStorageService.get("passport");

    var orderId = 0;
    if($stateParams.orderId){
        orderId = $stateParams.orderId;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    function refresh(id) {
        if (id <= 0)
            return;
        var obj = {
            passportId:$scope.passport.passportId,
            token:$scope.passport.token,
            orderId:id};
        orderDetailService.getDetails(obj).then(function(data){
            console.log(data);
            if ("OK" == data.status){
                var orderDetailsDto = data.result;
                if (orderDetailsDto.status != "ORDER_CREATED") {
                    $state.go('order.orderList');
                    return;
                }
                init(orderDetailsDto);
            }else{
                $state.go('order.orderList');
            }
        },function(err){

        });
    }

    function init(orderDetailsDto) {

        $scope.orderDetailsView = orderDetailsDto;
        if ($scope.orderDetailsView.status == "ORDER_CREATED" || $scope.orderDetailsView.status == "BLANK") {
            $scope.orderDetailsView.statusView = "未付款";
        } else if ($scope.orderDetailsView.status == "ORDER_PAID") {
            $scope.orderDetailsView.statusView = "服务中";
        } else if ($scope.orderDetailsView.status == "ORDER_FINISHED") {
            $scope.orderDetailsView.statusView = "已完成";
        }
    }

    refresh(orderId);

    $scope.toOrderList = function () {
        $state.go("order.orderList");
    };

    // H5调起微信支付
    $scope.toWxPay = function (orderDetailsView) {
        var obj = {
            passportId : $scope.passport.passportId,
            token : $scope.passport.token,
            openid : $scope.passport.token3,
            device : "WEB",
            title : orderDetailsView.itemList[0].title,
            pr : orderDetailsView.pr,
            paid : orderDetailsView.sales + orderDetailsView.freight - orderDetailsView.deposit,
            skuId : orderDetailsView.itemList[0].id,
            tradeType : "JSAPI"
        };
        orderDetailService.toWxPay(obj).then(function(data){
            if (data.result){

                WeixinJSBridge.invoke('getBrandWCPayRequest',{
                    "appId" : data.result.appId,
                    "timeStamp" : data.result.timeStamp+"",
                    "nonceStr" : data.result.nonceStr,
                    "package" : data.result.package,
                    "signType" : "MD5",
                    "paySign" : data.result.paySign
                },function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok"){
                        console.log("微信支付成功!");
                        var order = {
                            orderId:orderId
                        };
                        orderDetailService.onPaying(order).then(function(data){
                            if (data.status == "OK") {
                                if (data.result == "PAID"){
                                    $rootScope.orderDetailsView = null;
                                    if (orderDetailsView.type == 'FORWARD_PLAN'){
                                        $state.go('inServiceDetail', {orderId : orderId});
                                    } else if (orderDetailsView.type == 'NORMAL') {
                                        $state.go('normalDetail', {orderId: orderId});
                                    }
                                }else {
                                    $state.go('order.orderList');
                                }
                            }
                        },function(err){

                        });

                    }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                        console.log("用户取消支付!");
                    }else{
                        console.log("支付失败!");
                    }
                });
            }
        },function(err){

        });
    }
});