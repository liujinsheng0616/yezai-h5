/**
 * Created by kingson·liu on 2017/3/9.
 */
goceanApp.controller('MainMallCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, mallService, mallDetailService, configService, localStorageService) {

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        localStorageService.set("passport",params);
    }

    $scope.passport = localStorageService.get("passport");

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();


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
        $('#tab1').tab({defaultIndex:0,activeClass:"tab-green"});
        var selectViewId = localStorageService.get("selectViewId");
        if (selectViewId){
            $("#view"+ selectViewId).addClass("tab-green").siblings().removeClass('tab-green');
            $scope.listItems(selectViewId);
        }
    }, 10);



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
    };

    $scope.listItems = function (id) {
        $rootScope.viewCatetoryId = id;
        localStorageService.remove("selectViewId");
        localStorageService.set("selectViewId", id);
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