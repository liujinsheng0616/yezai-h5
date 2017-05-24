/**
 * Created by Kingson·liu on 17/3/8.
 */
goceanApp.controller('OrderListCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams,orderListService,configService) {

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        $rootScope.passport = params;
    }

    if ($rootScope.passport == null ){
        var _state = "order.orderList";
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state="+_state;
        return;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    $scope.page = 1;
    $scope.rows = 10;
    // 下拉刷新
    var loading = false;

    // 底部tab选中
    $("#order").addClass("weui_active").siblings().removeClass('weui_active');
    $('#tab1').tab({defaultIndex:0,activeClass:"tab-green"});

    $scope.page = 1;
    $scope.rows = 10;
    $scope.curentStatus = 'ALL';
    //请求参数
    // 全部数据
    $scope.listOrder = function(status){
        if ($scope.curentStatus != status){
            $scope.curentStatus = status;
            $scope.orderList = [];
        }

        var obj = {
            page:$scope.page,
            rows:$scope.rows,
            passportId:$rootScope.passport.passportId,
            token:$rootScope.passport.token,
            status:$scope.curentStatus
        };

        orderListService.listOrder(obj).then(function(data){
            if ("OK" == data.status){
                var orderList = data.result;
                if (orderList && orderList.length > 0){
                    initView(orderList);
                    if ($scope.orderList && $scope.orderList.length > 0){
                        $scope.orderList = $scope.orderList.concat(orderList);
                    } else {
                        $scope.orderList = orderList;
                    }
                    if(!$scope.$$phase){
                        $scope.$apply();
                    }
                    $(".weui-infinite-scroll").html('');
                } else {
                    $(".weui-infinite-scroll").html('<p class="bottomNoMore"><div class="infinite-preloader"></div>没有更多</p>')
                    loading = true;
                }
            }
        },function(err){

        });
    };
    // 页面刷新加载
    $scope.listOrder(status);

    function initView(orderList){
        for (i in orderList){
            var brief = orderList[i];
            if (brief.status == "ORDER_CREATED"){
                brief.statusView = "未付款";
            }else if (brief.status == "ORDER_FINISHED"){
                brief.statusView = "已完成";
            }else if (brief.type == "FORWARD_PLAN" && brief.status == "ORDER_PAID"){
                brief.statusView = "服务中";
            }else if (brief.type == "NORMAL"){
                if (brief.deliveryStatus == null){
                    brief.statusView = "待发货";
                }else if(brief.deliveryStatus == "DELIVERING"){
                    brief.statusView = "送货中";
                }
            }
            var itemList = brief.itemList;
            for (j in itemList){
                var item = itemList[0];
                item.priceView = "¥" + item.price;
                if (item.pricePlus > 0){
                    item.priceView += " + "+item.pricePlus;
                }
            }
        }
    }

    // 跳转详情页
    $scope.goToOrderDetail = function (order) {
        $rootScope.orderDetailsView = null;

        if (order.status == "ORDER_CREATED"){
            $state.go('orderDetail', {orderId : order.id});
        }else {

            var obj = {
                passportId: $rootScope.passport.passportId,
                token: $rootScope.passport.token,
                orderId: order.id
            };
            orderListService.getDetails(obj).then(function (data) {
                if ("OK" == data.status) {
                    var orderDetailsDto = data.result;
                    $rootScope.orderDetailsView = orderDetailsDto;
                    $rootScope.orderDetailsView.isInited = false;

                    adapteDetails(order);
                }
            }, function (err) {

            });
        }

    };

    function adapteDetails(order){
        var id = order.id;
        var status = order.status;
        if (status == 'ORDER_PAID' || status == 'ORDER_FINISHED'){
            if (order.type == 'FORWARD_PLAN'){
                $state.go('inServiceDetail', {orderId : id});
            } else if (order.type == 'NORMAL') {
                $state.go('normalDetail', {orderId: id});
            }
        } else if (status == "ORDER_CREATED"){
            $state.go('orderDetail', {orderId : id});
        }
    }

    // 上拉刷新
    $("div.weui-pull-to-refresh").pullToRefresh().on("pull-to-refresh", function () {
        $scope.page = 1;
        setTimeout(function () {
            $(".comment-content").each(function(){
                $(this).remove();
            });
            $scope.listOrder($scope.curentStatus);
            $("div.weui-pull-to-refresh").pullToRefreshDone(); // 重置下拉刷新
        }, 1000);   //模拟延迟
    });

    // 下拉刷新
    $("div.weui-pull-to-refresh").infinite().on("infinite", function () {
        if (loading) return;
        $scope.page++;
        loading = true;
        setTimeout(function () {
            $scope.listOrder($scope.curentStatus);
            loading = false;
        }, 1000);   //模拟延迟
    });
    $(".infinite-preloader").on("show", function () { alert("it show!"); });
});