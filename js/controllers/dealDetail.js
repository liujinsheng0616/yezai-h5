/**
 * Created by 53983 on 2017/5/27.
 */
goceanApp.controller('DealDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, dealDetailService, configService,localStorageService) {
    console.log('about DealDetailCtrl');

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

    var _state = "dealDetail";
    if ($scope.passport == null ){
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state="+_state;
        return;
    }

    // 获取JSSDK
    // configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    // configService.hideWXBtn();

    $scope.page = 1;
    $scope.rows = 10;
    // 下拉刷新
    var loading = false;

    $scope.init = function (flag) {
        if (flag){
            $scope.page = 1;
            $scope.dealList = [];
        }
        var obj = {
            page:$scope.page,
            rows:$scope.rows,
            passportId : $scope.passport.passportId,
            token : $scope.passport.token
        };

        dealDetailService.dealDetailList(obj).then(function(data){

            if ("OK" == data.status) {

                if (data.result && data.result.length > 0){
                    var dealList = data.result;
                    for (i in dealList){
                        dealList[i].amount = dealList[i].amount / 100;
                    }
                    if ($scope.dealList && $scope.dealList.length > 0){
                        $scope.dealList = $scope.dealList.concat(dealList);
                    } else {
                        $scope.dealList = dealList;
                        if ($scope.dealList.length < 10){
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
    // 初始化
    $scope.init(true);

    // 上拉刷新
    $("div.weui-pull-to-refresh").pullToRefresh().on("pull-to-refresh", function () {
        $scope.page = 1;
        setTimeout(function () {
            $(".comment-content").each(function(){
                $(this).remove();
            });
            $scope.init(true);
            $("div.weui-pull-to-refresh").pullToRefreshDone(); // 重置下拉刷新
        }, 1000);   //模拟延迟
    });

    // 下拉刷新
    $("div.weui-pull-to-refresh").infinite().on("infinite", function () {
        if (loading) return;
        $scope.page++;
        loading = true;
        setTimeout(function () {
            $scope.init(false);
            loading = false;
        }, 1000);   //模拟延迟
    });
    $(".infinite-preloader").on("show", function () { alert("it show!"); });
});