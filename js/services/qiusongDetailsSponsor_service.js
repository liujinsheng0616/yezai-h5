/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.factory('qiusongDetailsSponsorService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var qiusongDetailsSponsorServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单详情
        qiusongDetailsSponsorServiceObj.getQiusongDetail = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.getQiusongDetail,
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

        qiusongDetailsSponsorServiceObj.qiusongAbort = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.qiusongAbort,
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

        qiusongDetailsSponsorServiceObj.qiusongSettle = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.qiusongSettle,
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


        return qiusongDetailsSponsorServiceObj;
    }]);