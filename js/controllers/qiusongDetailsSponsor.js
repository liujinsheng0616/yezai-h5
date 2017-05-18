/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.controller('QiusongDetailsSponsorCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, qiusongDetailsSponsorService, configService) {
    console.log("about QiusongDetailsSponsorCtrl");

    var url = window.location.href;
    var params = configService.parseQueryString(url);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        $rootScope.passport = params;
    }

    var id = 0;//这里和购买不一样，做服务端要特殊处理，qiusongId
    var sharerId = 0;
    if ($stateParams.id){
        id = $stateParams.id;
    }


    var _state = "qiusongDetailsSponsor/" + id;//FIXME
    if ($rootScope.passport == null){//如果是基础用户，这里不要求授权用户信息; 若果没登录，就直接通过授权模式登录
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }


    function init () {

        var obj = {
            passportId: $rootScope.passport.passportId,
            token : $rootScope.passport.token,
            crowdFundingId : id
        };

        qiusongDetailsSponsorService.getQiusongDetail(obj).then(function(data){
            if (data.status == "OK") {
                // CrowdFunding crowdFunding;
                // SkuBriefDto skuBriefDto;
                // List<CrowdFundingMember> memberList
                $scope.qiusong = data.result;
                if ($scope.qiusong.status == "ING") {
                    $scope.qiusong.status = "求送中";
                } else if ($scope.qiusong.status == "SUCCESSED") {
                    $scope.qiusong.status = "已完成";
                } else if ($scope.qiusong.status == "SETTLED") {
                    $scope.qiusong.status = "已结算";
                } else if ($scope.qiusong.status == "UN_PAY") {
                    $scope.qiusong.status = "未付款";
                } else if ($scope.qiusong.status == "PAID") {
                    $scope.qiusong.status = "已付款";
                }
                $scope.qiusong.sponsorName = Base64.decode($scope.qiusong.sponsorName);
            }else{
                $.alert("系统繁忙,请稍候再试");
            }
        },function(err){
            $.alert("系统繁忙,请稍候再试");
        });

    };

    init();


});
