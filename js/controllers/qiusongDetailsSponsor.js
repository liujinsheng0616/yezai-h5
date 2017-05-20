/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.controller('QiusongDetailsSponsorCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, qiusongDetailsSponsorService, configService, appSettings, mainHomeService) {
    console.log("about QiusongDetailsSponsorCtrl");

    var url = window.location.href;
    var params = configService.parseQueryString(url);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        $rootScope.passport = params;
    }

    var id = 0;//这里和购买不一样，做服务端要特殊处理，qiusongId
    if ($stateParams.id){
        id = $stateParams.id;
    }

    var _state = "qiusongDetailsSponsor/" + id;//FIXME
    if ($rootScope.passport == null){//如果是基础用户，这里不要求授权用户信息; 若果没登录，就直接通过授权模式登录
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }

    var sharedUrl =  appSettings.domain + "/#/qiusongShared/"+id +"/"+$rootScope.passport.passportId;

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);

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
                console.log($scope.qiusong);
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
                if ($scope.qiusong.memberList && $scope.qiusong.memberList.length > 0){
                    for(i in $scope.qiusong.memberList){
                        $scope.qiusong.memberList[i].nickName = Base64.decode($scope.qiusong.memberList[i].nickName);
                    }
                }
                // 分享组装
                shared();
            }else{
                $.alert("系统繁忙,请稍候再试");
            }
        },function(err){
            $.alert("系统繁忙,请稍候再试");
        })
    };

    init();

    // 分享
    function shared (){
        // 设置分享
        wx.ready(function() {
            wx.checkJsApi({
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function (res) {
                    wx.showOptionMenu();
                    //分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: $rootScope.passport.nickName + '也在发起求送: 邀请你参与---' + $scope.qiusong.skuBriefDto.title, // 分享标题
                        link:  sharedUrl, // 分享链接
                        imgUrl: 'http://static.yezaigou.com/' + $scope.qiusong.skuBriefDto.thumbnail, // 分享图标
                        success: function () {

                        },
                        cancel: function () {

                        }
                    });

                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: $rootScope.passport.nickName + '也在发起求送: 邀请你参与---' + $scope.qiusong.skuBriefDto.title, // 分享标题
                        desc: $scope.qiusong.skuBriefDto.payDescription, // 分享描述
                        link: sharedUrl, // 分享链接
                        imgUrl: 'http://static.yezaigou.com/' + $scope.qiusong.skuBriefDto.thumbnail, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {

                        },
                        cancel: function () {

                        }
                    });
                }
            });
        });
    }
});
