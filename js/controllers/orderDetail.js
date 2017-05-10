/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.controller('OrderDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, orderDetailService, mallHomePublishService) {
    console.log("about OrderDetailCtrl");

    var orderId = 0;
    if($stateParams.orderId){
        orderId = $stateParams.orderId;
    }

    function refresh(id) {
        if (id <= 0)
            return;
        var obj = {
            passportId:$rootScope.passport.passportId,
            token:$rootScope.passport.token,
            orderId:id};
        orderDetailService.getDetails(obj).then(function(data){
            console.log(data);
            if ("OK" == data.status){
                var orderDetailsDto = data.result;
                init(orderDetailsDto);
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

    if (!$rootScope.orderDetailsView) {
        refresh(orderId);
    }else if ($rootScope.orderDetailsView.isInited == false){
        $rootScope.orderDetailsView.isInited == true;
        init($rootScope.orderDetailsView);
    }

    // H5调起微信支付
    $scope.toWxPay = function (orderDetailsView) {
        var obj = {
            passportId : $rootScope.passport.passportId,
            token : $rootScope.passport.token,
            openid : $rootScope.passport.token3,
            device : "WEB",
            title : orderDetailsView.itemList[0].title,
            pr : orderDetailsView.pr,
            paid : 1,
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