/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.factory('qiusongPayService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var qiusongPayServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单详情
        qiusongPayServiceObj.getPayDetails = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.qiusongPayDetail,
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
        qiusongPayServiceObj.toWxPay = function (params) {
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

        // 微信支付请求
        qiusongPayServiceObj.qiusongOnPaying = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.qiusongOnPaying,
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

        return qiusongPayServiceObj;
    }]);