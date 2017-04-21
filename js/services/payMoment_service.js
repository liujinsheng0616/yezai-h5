/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.factory('payMomentService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var payMomentServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单详情
        payMomentServiceObj.getDefaultAddress = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.getDefaultAddress,
                type:'POST',
                params:params
            };
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);
            },function(err){
                defer.reject(err);
            });
            return defer.promise;
        };

        payMomentServiceObj.getForwardPlanSelector = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.forwardPlanSelector,
                type:'POST',
                params:params
            };
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);
            },function(err){
                defer.reject(err);
            });
            return defer.promise;
        };

        return payMomentServiceObj;
    }]);