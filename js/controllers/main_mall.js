/**
 * Created by kingson·liu on 2017/3/9.
 */
goceanApp.controller('MainMallCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, mallService, mallDetailService) {

    var str = window.location.href;
    var arr = str.split("?");
    if (arr.length>1){
        var kv = arr[1].split("&");
        for (i in kv){
            var kvArr = kv[i].split("=");
            var key = kvArr[0];
            var value = kvArr[1];
            store.passport[key] = value;
        }
    }else{
        var _state = "mall";
        if ($rootScope.passport == null){
            window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state="+_state;
            return;
        }
    }
    if ($rootScope.passport == null){
        $rootScope.passport = store.passport;
    }
    // 底部tab选中
    $("#mall").addClass('weui_active').siblings().removeClass('weui_active');

    $rootScope.tabbar = "GOU";// YEZAI | GOU |MY | ORDER | GROUPON
    if ($rootScope.viewCatetoryId == null){ //后退的状态, FIXME 无法聚焦NAVBAR, TABBAR 也没选择, 需要封装个方法刷新BAR
        $rootScope.viewCatetoryId = 1;
    }

    $scope.page = 1;
    $scope.rows = 5;
    var obj = {
        viewCategoryId:$rootScope.viewCatetoryId,
        page:$scope.page,
        rows:$scope.rows
    };
    mallService.getMallList(obj).then(function(data){
        console.log(data);
        if (data.status == "OK"){
        	$scope.itemList = data.result;
            if(!$scope.$$phase){
                $scope.$apply();
            }
        }
        
    },function(err){

    });
	

    $rootScope.viewCateory = store.mall.viewCateory;
    var tabWidth = 20 * $scope.viewCateory.length;
    $("#cTab").css({"width":tabWidth+"%","height":"44px"});
    setTimeout(function () {
            $('#tab1').tab({defaultIndex:0,activeClass:"tab-green"})
    },10
    );

    /*
     * DEMO 分页，没用，
     */
    $scope.onScrollPagination = function (){
        $scope.page += 1;
        var obj = {
            viewCategoryId:$rootScope.viewCatetoryId,
            page:$scope.page,
            rows:$scope.rows
        };
        mallService.getMallList(obj).then(function(data){
            if (data.status == "OK"){
                $scope.itemList = data.result;
                for (i in data.result){
                    $scope.itemList.push(data.result[i]);
                }
                if(!$scope.$$phase){
                    $scope.$apply();
                }
            }

        },function(err){

        });
    }

    $scope.listItems = function (id) {
        $rootScope.viewCatetoryId = id;
        var obj = {
                viewCategoryId:id,
                page:$scope.page,
                rows:$scope.rows
            };
            mallService.getMallList(obj).then(function(data){
                if (data.status == "OK"){
                	$scope.itemList = data.result;
                    if(!$scope.$$phase){
                        $scope.$apply();
                    }
                }
                
            },function(err){

            });
    };
    
    $scope.getItemDetail = function (params) {
        // var params = {goodsId:goodsId};
        $rootScope.itemDetail = null;
            mallDetailService.getMallDetail(params).then(function(data){
            console.log(data);
            if (data.status == "OK"){
                $rootScope.itemDetail = data.result;
                $state.go("itemDetail",params);
            }

        },function(err){

        });
    };
});