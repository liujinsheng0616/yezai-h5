/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.controller('QiusongDetailsSponsorCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, qiusongDetailsSponsorService, configService, appSettings, mainHomeService, localStorageService) {
    console.log("about QiusongDetailsSponsorCtrl");

    var url = window.location.href;
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

    var id = 0;//这里和购买不一样，做服务端要特殊处理，qiusongId
    if ($stateParams.id){
        id = $stateParams.id;
    }

    var _state = "qiusongDetailsSponsor/" + id;//FIXME
    if ($scope.passport == null){//如果是基础用户，这里不要求授权用户信息; 若果没登录，就直接通过授权模式登录
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }

    var sharedUrl =  appSettings.domain + "/#/qiusongShared/"+id +"/"+$scope.passport.passportId;

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);

    function init () {

        var obj = {
            passportId: $scope.passport.passportId,
            token : $scope.passport.token,
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
                    $scope.qiusong.statusView = "求送中";
                    if ($scope.qiusong.totalTimes >= $scope.qiusong.memberCount){
                        $scope.qiusong.statusView = "审核中";
                    }
                } else if ($scope.qiusong.status == "SUCCESSED") {
                    $scope.qiusong.statusView = "已完成";
                } else if ($scope.qiusong.status == "SETTLED") {
                    $scope.qiusong.statusView = "已结算";
                    if ($scope.qiusong.settleType == "BUY_ONLY"){
                        $scope.qiusong.settleTypeView = "全额购物";
                    }else if ($scope.qiusong.settleType == "DRAW_ONLY"){
                        $scope.qiusong.settleTypeView = "暂时中止";
                    }else if ($scope.qiusong.settleType == "BUY_DRAW"){
                        $scope.qiusong.settleTypeView = "超送结余";
                    }
                }
                // else if ($scope.qiusong.status == "UN_PAY") {
                //     $scope.qiusong.status = "未付款";
                // } else if ($scope.qiusong.status == "PAID") {
                //     $scope.qiusong.status = "已付款";
                // }
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
                        title:  $scope.qiusong.sponsorName + '也在发起求送，邀请你参与！',// 分享标题
                        desc:  $scope.qiusong.skuBriefDto.title +"(" +$scope.qiusong.skuBriefDto.payDescription +")", // 分享描述
                        link:  sharedUrl, // 分享链接
                        imgUrl: 'http://static.yezaigou.com/' + $scope.qiusong.skuBriefDto.thumbnail, // 分享图标
                        success: function () {

                        },
                        cancel: function () {

                        }
                    });

                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: $scope.qiusong.sponsorName + '也在发起求送，邀请你参与！',// 分享标题
                        desc:  $scope.qiusong.skuBriefDto.title +"(" +$scope.qiusong.skuBriefDto.payDescription +")", // 分享描述
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

    $scope.toItem = function(id){
        $state.go("itemDetail",{goodsId:id,sharerIdStr:"sharerId_"+$scope.passport.passportId})
    };

    $scope.abort = function(qiusong){
        var obj = {
            passportId: $scope.passport.passportId,
            token : $scope.passport.token,
            crowdFundingId : id
        };
        qiusongDetailsSponsorService.qiusongAbort(obj).then(function(data){
            if (data.status == "OK") {
                window.location.reload();
            }else{
                $.alert("系统繁忙,请稍候再试");
            }
        },function(err){
            $.alert("系统繁忙,请稍候再试");
        })
    };

    $scope.settle = function(qiusong){
        var dto = $scope.qiusong.skuBriefDto;
        $state.go("payment", {
            goodsId:dto.goodsId,
            skuId:dto.id,
            title : dto.title,
            payDescription : dto.payDescription,
            price : dto.price,
            thumbnail : dto.thumbnail,
            type : dto.type,
            payAttachment:null,
            sharerId:0,
            isPaid:true,
            crowdFundingId:$scope.qiusong.id
        });
    };


});
