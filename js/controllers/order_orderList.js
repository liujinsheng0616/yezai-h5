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
        var _state = "orderList";
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state="+_state;
        return;
    }
    // 底部tab选中
    $("#order").addClass("weui_active").siblings().removeClass('weui_active');
    $('#tab1').tab({defaultIndex:0,activeClass:"tab-green"});

    $scope.page = 1;
    $scope.rows = 10;
    var status = 'ALL';
    //请求参数
    // 全部数据
    $scope.listOrder = function(status){
        var obj = {
            page:$scope.page,
            rows:$scope.rows,
            passportId:$rootScope.passport.passportId,
            token:$rootScope.passport.token,
            status:status};

            orderListService.listOrder(obj).then(function(data){
                console.log(data);
                if ("OK" == data.status){
                    var orderList = data.result;
                    initView(orderList);
                    $scope.orderList = orderList;
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
            }else if (brief.status == "ORDER_PAID"){
                brief.statusView = "服务中";
            }else if (brief.status == "ORDER_FINISHED"){
                brief.statusView = "已完成";
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
    $scope.goToOrderDetail = function (id) {
        var obj = {
            passportId:$rootScope.passport.passportId,
            token:$rootScope.passport.token,
            orderId:id};
        orderListService.getDetails(obj).then(function(data){
            console.log(data);
            if ("OK" == data.status){
                var orderDetails = data.result;
                adapteDetails(orderDetails);
            }
        },function(err){

        });

    }

    function adapteDetails(orderDetails){
        var status = orderDetails.status;
        if (status == 'ORDER_PAID' || status == 'ORDER_FINISHED'){
            if (type == 'FORWARD'){
                $state.go('inServiceDetail', {orderDetailsDto : orderDetails});
            } else if (type == 'NORMAL')
                $state.go('normalDetail', {orderDetailsDto : orderDetails});
            $rootScope.status = status;
        } else if (status == "ORDER_CREATED"){
            $state.go('orderDetail', {orderDetailsDto : orderDetails});
        }
    }
});