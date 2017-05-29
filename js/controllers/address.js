/**
 * Created by kingson·liu on 2017/3/12.
 */
goceanApp.controller('AddressCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, addressService, localStorageService,configService) {

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = Base64.decode(params.nickName);
        localStorageService.set("passport",params);
    }
    $scope.passport = localStorageService.get("passport");
    var _state = "address";
    if ($scope.passport == null){
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state="+_state;
        return;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    $("#ssx").cityPicker({
        title: "选择省市县"
    });

    function reset() {
        $scope.address = {// save, createOrRefresh, 选中地址，设置为default,并且可以更新
            id:0,
            country: "",
            province: "",
            city: "",
            area: "",
            address: "",
            receiver: "",
            tel: "",
            temp:""
        };
    }

        var addressList = [];
        var obj = {
            passportId:$scope.passport.passportId,
            token:$scope.passport.token
        };
        addressService.listAddress(obj).then(function(data){
            console.log(data);
            if (data.status == "OK") {
                var result = data.result;

                $scope.addressList = result.addressList;
                addressList = $scope.addressList;
                var defaultId = result.defaultId;
                initDefaultAddress(addressList, defaultId);

            }
            reset();
        },function(err){

        });

        function initDefaultAddress(addressList, defaultId) {
            if (addressList.length > 0) {
                for (i in addressList) {
                    var address = addressList[i];
                    if (address.id == defaultId) {
                        address.isDefault = 1;
                        $rootScope.defaultAddress = address;
                    } else {
                        address.isDefault = 0;
                    }

                }
            }

        }
        // $rootScope.addressList = store.addressList;
   //

    // 改变全局默认地址内容
    $scope.changeDefaultAddress = function (address) {
        $scope.address = address;
        $rootScope.defaultAddress = address;
        var obj = {
            passportId:$scope.passport.passportId,
            token:$scope.passport.token,
            id:address.id
        };
        addressService.setDefaultAddress(obj).then(function(data){
            console.log(data);
            if (data.status == "OK") {
                for (i in addressList) {
                    var addr = addressList[i];
                    if (addr.id == address.id) {
                        addr.isDefault = 1;
                    }else{
                        addr.isDefault = 0;
                    }
                }
                if ($rootScope.isAddressChanged != null && $rootScope.isAddressChanged != "undefined" && $rootScope.isAddressChanged == 0){
                    $rootScope.isAddressChanged = 1;
                }
            }
        },function(err){

        });
    }


    $scope.createOrRefresh = function (){
            var arr = $scope.address.temp.split(" ");
            var obj = {
                passportId:$scope.passport.passportId,
                token:$scope.passport.token,
                id:$scope.address.id,
                country:$scope.address.country,
                province:arr[0],
                city:arr[1],
                area:arr[2],
                address:$scope.address.address,
                receiver:$scope.address.receiver,
                tel:$scope.address.tel
            }
            addressService.createOrRefresh(obj).then(function(data){
                console.log(data);
                if (data.status == "OK") {
                    var result = data.result;

                    $scope.addressList = result.addressList;
                    addressList = $scope.addressList;
                    var defaultId = result.defaultId;
                    if (addressList.length == 1) {
                        $rootScope.defaultAddress = addressList[0];
                    }
                    initDefaultAddress(addressList, defaultId);
                }
                reset();
            },function(err){

            });
    }
});
