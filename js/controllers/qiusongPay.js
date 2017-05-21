/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.controller('QiusongPayCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, qiusongPayService, configService) {
    console.log("about QiusongPayCtrl");

    if ($rootScope.passport == null) {
        var url = window.location.href;
        var params = configService.parseQueryString(url);
        if (params.passportId) {
            params.nickName = Base64.decode(params.nickName);
            $rootScope.passport = params;
        }
    }

    var qiusongId = 0;
    var memberId = 0;
    if($stateParams.qiusongId){
        qiusongId = $stateParams.qiusongId;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    function refresh(id) {
        if (id <= 0)
            return;
        var obj = {
            passportId : $rootScope.passport.passportId,
            token : $rootScope.passport.token,
            crowdFundingId : id
        };
        qiusongPayService.getPayDetails(obj).then(function(data){
            console.log(data);
            if ("OK" == data.status){
                var qiusongDetailsDto = data.result;
                init(qiusongDetailsDto);
            }else{
                $state.go("order.qiusong");
            }
        },function(err){

        });
    }

    function init(qiusongDetailsDto) {

        $scope.qiusongDetailsView = qiusongDetailsDto;
        if ($scope.qiusongDetailsView.status == "ING") {
            $scope.qiusongDetailsView.statusView = "求送中";
        } else if ($scope.qiusongDetailsView.status == "SUCCESSED") {
            $scope.qiusongDetailsView.statusView = "已完成";
        } else if ($scope.qiusongDetailsView.status == "SETTLED") {
            $scope.qiusongDetailsView.statusView = "已结算";
        } else if ($scope.qiusongDetailsView.status == "UN_PAY") {
            $scope.qiusongDetailsView.statusView = "未付款";
        } else if ($scope.qiusongDetailsView.status == "PAID") {
            $scope.qiusongDetailsView.statusView = "已付款";
        }
    }

    refresh(qiusongId);
    // 返回求送列表
    $scope.toQiusongList = function () {
        $state.go("order.qiusong");
    };

    // H5调起微信支付
    $scope.toWxPay = function (qiusongDetailsView) {
        var obj = {
            passportId : $rootScope.passport.passportId,
            token : $rootScope.passport.token,
            openid : $rootScope.passport.token3,
            device : "WEB",
            title : qiusongDetailsView.skuBriefDto.title,
            pr : qiusongDetailsView.pr,
            paid : qiusongDetailsView.unitAmount,
            skuId : qiusongDetailsView.skuBriefDto.id,
            tradeType : "JSAPI"
        };
        qiusongPayService.toWxPay(obj).then(function(data){
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
                            passportId : $rootScope.passport.passportId,
                            token : $rootScope.passport.token,
                            crowdFundingId : qiusongId
                        };
                        qiusongPayService.qiusongOnPaying(order).then(function(data){
                            if (data.status == "OK") {
                                if (data.result == "PAID"){
                                    $state.go('qiusongDetailsSponsor', {id : qiusongId});
                                }else {
                                    $state.go('order.qiusong');
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