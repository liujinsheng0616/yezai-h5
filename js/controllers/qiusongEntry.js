/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.controller('QiusongEntryCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, qiusongEntryService, configService) {
    console.log("about QiusongEntryCtrl");

    var url = window.location.href;
    var params = configService.parseQueryString(url);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        $rootScope.passport = params;
    }

    var skuId = 0;//这里和购买不一样，做服务端要特殊处理，先获得goodsId
    var sharerId = 0;
    if ($stateParams.itemId){
        skuId = $stateParams.itemId;
    }

    if (skuId == 0) {
        alert("没有此求送商品,id = " + skuId);
        return;
    }

    if ($stateParams.sharerId){
        sharerId = $stateParams.sharerId;
    }
    var _state = "qiusongEntry/" + skuId+"/"+sharerId;//FIXME 登录后返回当前页面，需要参数skuId
    if ($rootScope.passport == null){//如果是基础用户，这里不要求授权用户信息; 若果没登录，就直接通过授权模式登录
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }

    // 隐藏右上角
    setTimeout(function(){
        configService.hideWXBtn();
    },100);



    function init () {

        var obj = {
            skuId: skuId
        };

        qiusongEntryService.getItemBrief(obj).then(function(data){
            if (data.status == "OK") {
                var itemBrief = data.result;
                $scope.qiusongRo = itemBrief;
                $scope.qiusongRo.memberCount = 3;
            }else{
                alert("系统繁忙,请稍候再试");
            }
        },function(err){
            alert("系统繁忙,请稍候再试");
        });

    };



    $scope.create = function () {


            var obj = {//为了以后扩展用户自创建，而统一请求数据, itemId ==0
                passportId:$rootScope.passport.passportId,
                token:$rootScope.passport.token,
                itemId:$scope.qiusongRo.skuId,
                price:$scope.qiusongRo.price,
                memberCount:$scope.qiusongRo.memberCount,//必要
                title:$scope.qiusongRo.title,
                thumbnail:$scope.qiusongRo.thumbnail,
                payDescription:$scope.qiusongRo.payDescriptio
            }

        qiusongEntryService.createQiusong(obj).then(function(data){
            if (data.status == "OK") {
                var id = data.result;
                $state.go("qiusongDetailsSponsor", {
                    id: id
                });
            }else{
                alert("系统繁忙,请稍候再试");
            }
        },function(err){
            alert("系统繁忙,请稍候再试");
        });
    };

    init();
});
