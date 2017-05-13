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

    // 隐藏右上角
    setTimeout(function(){
        configService.hideWXBtn();
    },100);

    // 底部tab选中
    $("#qiusong").addClass("weui_active").siblings().removeClass('weui_active');
    $('#tab1').tab({defaultIndex:0,activeClass:"tab-green"});

    $scope.page = 1;
    $scope.rows = 10;
    var status = 'ING';
    //请求参数
    // 全部数据
    $scope.listQiusong = function(status){
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
                initView(qiusongList);
                $scope.qiusongList = qiusongList;
            }
        },function(err){

        });
    };
    // 页面刷新加载
    $scope.listQiusong(status);

    function initView(qiusongList){
        for (i in qiusongList){
            var brief = qiusongList[i];
            if (brief.crowdFunding.status == "ING"){
                brief.statusView = "求送中";
            }else if (brief.crowdFunding.status == "SUCCESSED"){
                brief.statusView = "已完成";
            }else if (brief.crowdFunding.status == "SETTLED"){
                brief.statusView = "已结算";
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
            $state.go('qiusongPrepay', {qiusongId: qiusong.id, memberId: $rootScope.passport.passportId});
        }else {

            var obj = {
                passportId: $rootScope.passport.passportId,
                token: $rootScope.passport.token,
                qiusongId: qiusong.id
            };
            qiusongListService.getDetails(obj).then(function (data) {
                if ("OK" == data.status) {
                    var qiusongDetailsDto = data.result;
                    $rootScope.qiusongDetailsView = qiusongDetailsDto;
                    $rootScope.qiusongDetailsView.isInited = false;

                    adaptDetails(qiusong);
                }
            }, function (err) {

            });
        }

    }

    function adaptDetails(qiusong){
        var id = qiusong.id;
        var status = qiusong.status;
        if (qiusong.sponsorId == $rootScope.passport.passportId){

        } else{

        }
    }
});