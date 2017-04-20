/**
 * Created by kingson·liu on 2017/3/9.
 */
goceanApp.controller('MainMineCtrl', function ($scope,$rootScope, $state, $timeout, $stateParams,mainMineService) {

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
    }

    if ($rootScope.passport == null){
        $rootScope.passport = store.passport;
    }
    // 底部tab选中
    $("#mine").addClass("weui_active").siblings().removeClass('weui_active');

    if ($rootScope.my){
        $scope.my = $rootScope.my;
    }else {
        var obj = {a:1};
        mainMineService.getMyInfo(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }
});