/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.factory('orderDetailService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var orderDetailServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单详情
        orderDetailServiceObj.getDetails = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.orderDetails,
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

        // 微信支付请求
        orderDetailServiceObj.toWxPay = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host2+appSettings.requestURL.wxPay,
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

        return orderDetailServiceObj;
    }]);