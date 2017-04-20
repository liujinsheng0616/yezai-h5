/**
 * Created by kingson·liu on 2017/3/12.
 */
goceanApp.controller('AddressCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, addressService) {
    $("#ssx").cityPicker({
        title: "选择省市县"
    });

    // 收获地址数据映射
    if ($rootScope.addressList){
        $scope.addressList = $rootScope.addressList;
    } else {
        var obj = {a:1};
        addressService.getAddressInfo(obj).then(function(data){
            console.log(data);
        },function(err){

        });
        $rootScope.addressList = store.addressList;
    }

    // 改变全局默认地址内容
    $scope.changeDefaultAddress = function (address) {
        $rootScope.defaultAddress = address;
        if ($stateParams.title){
            $rootScope.title = $stateParams.title;
        }
        if ($stateParams.month){
            $rootScope.month = $stateParams.month;
        }
        if ($stateParams.price){
            $rootScope.price = $stateParams.price;
        }
        if ($stateParams.mainPic){
            $rootScope.mainPic = $stateParams.mainPic;
        }
    }
});
