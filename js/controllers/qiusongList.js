/**
 * Created by kingson·liu on 17/3/8.
 */
goceanApp.controller('OrderQiusongCtrl', function ($rootScope,$scope, $state, $timeout, $stateParams, qiusongListService, configService, localStorageService) {

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

    if ($scope.passport == null  || $scope.passport.type == "BLANK"){
        var _state = "order.qiusong";
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
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

    // 下拉刷新
    var loading = false;

    $scope.curentStatus = 'ING';
    //请求参数
    // 全部数据
    $scope.listQiusong = function(status, flag){
        if ($scope.curentStatus != status){
            $scope.curentStatus = status;
            $scope.qiusongList = [];
        }
        if (flag){
            $scope.page = 1;
            $scope.qiusongList = [];
        }

        var obj = {
            page:$scope.page,
            rows:$scope.rows,
            passportId:$scope.passport.passportId,
            token:$scope.passport.token,
            status:$scope.curentStatus};

        qiusongListService.listQiusong(obj).then(function(data){
            if ("OK" == data.status){
                var qiusongList = data.result;
                if (qiusongList && qiusongList.length > 0){
                    initView(qiusongList, $scope.curentStatus);
                    if ($scope.qiusongList && $scope.qiusongList.length > 0){
                        $scope.qiusongList = $scope.qiusongList.concat(qiusongList);
                    } else {
                        $scope.qiusongList = qiusongList;
                        if ($scope.qiusongList.length < 10){
                            $(".weui-infinite-scroll").html('');
                        } else {
                            $(".weui-infinite-scroll").html('<p class="loading"><div class="infinite-preloader"></div>正在加载...</p>')
                            loading = false;
                        }
                    }
                    if(!$scope.$$phase){
                        $scope.$apply();
                    }
                } else {
                    $(".weui-infinite-scroll").html('<p class="bottomNoMore"><div class="infinite-preloader"></div>没有更多</p>')
                    loading = true;
                }
            }
        },function(err){

        });
    };
    // 页面刷新加载
    $scope.listQiusong($scope.curentStatus, null);

    $scope.status = $scope.curentStatus;
    function initView(qiusongList, status){
        for (i in qiusongList){
            var brief = qiusongList[i];
            var crowdFunding = brief.crowdFunding;
            if (brief.crowdFunding.status == "ING"){
                brief.statusView = "求送中";
                if (brief.totalTimes >= brief.crowdFunding.memberCount){
                    brief.statusView = "审核中";
                }
            }else if (crowdFunding.status == "SUCCESSED"){
                brief.statusView = "已完成";
            }else if (crowdFunding.status == "SETTLED"){
                brief.statusView = "已结算";
                if (crowdFunding.settleType == "BUY_ONLY"){
                    crowdFunding.settleTypeView = "全额购物";
                }else if (crowdFunding.settleType == "DRAW_ONLY"){
                    crowdFunding.settleTypeView = "暂时中止";
                }else if (crowdFunding.settleType == "BUY_DRAW"){
                    crowdFunding.settleTypeView = "超送结余";
                }
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

        if (qiusong.payStatus == "UN_PAY" && qiusong.sponsorId != $scope.passport.passportId){
            if (!(qiusong.crowdFunding.status == "SUCCESSED" || qiusong.crowdFunding.status == "SETTLED")){
                $state.go('qiusongPrepay', {
                    qiusongId: qiusong.crowdFunding.id,
                    memberId: $scope.passport.passportId
                });
            }
        }else {

            adaptDetails(qiusong);
            // var obj = {
            //     passportId: $scope.passport.passportId,
            //     token: $scope.passport.token,
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
        // if (qiusong.crowdFunding.sponsorId == $scope.passport.passportId){
        //     $state.go("qiusongDetailsSponsor",{id:id});
        // } else{
        //
        // }

        $state.go("qiusongDetailsSponsor",{id:id});
    }

    // 上拉刷新
    $("div.weui-pull-to-refresh").pullToRefresh().on("pull-to-refresh", function () {
        $scope.page = 1;
        setTimeout(function () {
            $(".comment-content").each(function(){
                $(this).remove();
            });
            $scope.listQiusong($scope.curentStatus, 1);
            $("div.weui-pull-to-refresh").pullToRefreshDone(); // 重置下拉刷新
        }, 1000);   //模拟延迟
    });

    // 下拉刷新
    $("div.weui-pull-to-refresh").infinite().on("infinite", function () {
        if (loading) return;
        $scope.page++;
        loading = true;
        setTimeout(function () {
            $scope.listQiusong($scope.curentStatus, null);
            loading = false;
        }, 1000);   //模拟延迟
    });
    $(".infinite-preloader").on("show", function () { alert("it show!"); });
});