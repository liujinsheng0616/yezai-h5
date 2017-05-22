/**
 * Created by kingson·liu on 17/3/8.
 */
goceanApp.controller('OrderQiusongCtrl', function ($rootScope,$scope, $state, $timeout, $stateParams, qiusongListService, configService) {

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        $rootScope.passport = params;
    }

    if ($rootScope.passport == null ){
        var _state = "order.qiusong";
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state="+_state;
        return;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    // 底部tab选中
    $("#qiusong").addClass("weui_active").siblings().removeClass('weui_active');
    $('#tab1').tab({defaultIndex:0,activeClass:"tab-green"});

    $scope.page = 1;
    $scope.rows = 10;
    var status = 'ING';
    $scope.status = status;
    //请求参数
    // 全部数据
    $scope.listQiusong = function(status){
        $scope.status = status;
        var obj = {
            page:$scope.page,
            rows:$scope.rows,
            passportId:$rootScope.passport.passportId,
            token:$rootScope.passport.token,
            status:status};

        qiusongListService.listQiusong(obj).then(function(data){
            console.log(data);
            if ("OK" == data.status){
                var qiusongList = data.result;
                initView(qiusongList, status);
                $scope.qiusongList = qiusongList;
            }
        },function(err){

        });
    };
    // 页面刷新加载
    $scope.listQiusong(status);

    function initView(qiusongList, status){
        for (i in qiusongList){
            var brief = qiusongList[i];
            if (brief.crowdFunding.status == "ING"){
                brief.statusView = "求送中";
                if (brief.totalTimes >= brief.crowdFunding.memberCount){
                    brief.statusView = "审核中";
                }
            }else if (brief.crowdFunding.status == "SUCCESSED"){
                brief.statusView = "已完成";
            }else if (brief.crowdFunding.status == "SETTLED"){
                brief.statusView = "已结算";
            }

            if (status == "UN_PAY"){
                brief.payStatus = "UN_PAY";
                if (brief.crowdFunding.status == "SUCCESSED" || brief.crowdFunding.status == "SETTLED"){
                    brief.statusView = "已超时";
                }

            }else if (status = "PAID"){
                brief.payStatus = "PAID";
            }
            if (status == "UN_PAY" || status == "PAID") {
                brief.sponsorName = Base64.decode(brief.sponsorName);
            }

            var itemList = brief.itemList;
            for (j in itemList){
                var item = itemList[0];
                item.priceView = "¥" + item.price;
            }
        }
    }

    // 跳转详情页
    $scope.goToQiusongDetail = function (qiusong) {
        $rootScope.qiusongDetailsView = null;

        if (qiusong.payStatus == "UN_PAY" && qiusong.sponsorId != $rootScope.passport.passportId){
            if (!(qiusong.crowdFunding.status == "SUCCESSED" || qiusong.crowdFunding.status == "SETTLED")){
                $state.go('qiusongPrepay', {
                    qiusongId: qiusong.crowdFunding.id,
                    memberId: $rootScope.passport.passportId
                });
            }
        }else {

            adaptDetails(qiusong);
            // var obj = {
            //     passportId: $rootScope.passport.passportId,
            //     token: $rootScope.passport.token,
            //     crowdFundingId: qiusong.crowdFunding.id
            // };
            // qiusongListService.getDetails(obj).then(function (data) {
            //     if ("OK" == data.status) {
            //         var qiusongDetailsDto = data.result;
            //         $rootScope.qiusongDetailsView = qiusongDetailsDto;
            //         $rootScope.qiusongDetailsView.isInited = false;
            //
            //         adaptDetails(qiusong);
            //     }
            // }, function (err) {
            //
            // });
        }

    };

    function adaptDetails(qiusong){
        var id = qiusong.crowdFunding.id;
        // if (qiusong.crowdFunding.sponsorId == $rootScope.passport.passportId){
        //     $state.go("qiusongDetailsSponsor",{id:id});
        // } else{
        //
        // }

        $state.go("qiusongDetailsSponsor",{id:id});
    }
});