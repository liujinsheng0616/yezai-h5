/**
 * Created by kingson·liu on 2017/3/9.
 */
goceanApp.controller('MainMallCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, mallService) {

    var obj = {
        viewCategoryId:1,
        page:1,
        rows:10
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

    $scope.viewCateory = store.mall.viewCateory;
    var tabWidth = 20 * $scope.viewCateory.length;
    $("#cTab").css({"width":tabWidth+"%","height":"44px"});
    setTimeout(function () {
            $('#tab1').tab({defaultIndex:0,activeClass:"tab-green"})
    },10
    );

    $scope.getItemDetail = function (goodsId) {

    };
});