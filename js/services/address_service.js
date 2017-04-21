/**
 * Created by kingson·liu on 2017/3/12.
 */
goceanApp.factory('addressService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope, ajaxUtil,appSettings) {
        var addressServiceObj = {};
        /*给服务对象注册方法*/
        //获得收获地址数据
        addressServiceObj.listAddress = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.listAddress,
                type:'POST',
                params:params
            }
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);
            },function(err){
                defer.reject(err);
            })
            return defer.promise;
        };

        addressServiceObj.createOrRefresh = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.createOrRefresh,
                type:'POST',
                params:params
            }
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);
            },function(err){
                defer.reject(err);
            })
            return defer.promise;
        };

        addressServiceObj.setDefaultAddress = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.setDefaultAddress,
                type:'POST',
                params:params
            }
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);
            },function(err){
                defer.reject(err);
            })
            return defer.promise;
        };

        return addressServiceObj;



    }]);