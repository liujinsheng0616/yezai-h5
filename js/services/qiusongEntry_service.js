/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.factory('qiusongEntryService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var qiusongEntryServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单详情
        qiusongEntryServiceObj.getItemBrief = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.getItemBrief,
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



        qiusongEntryServiceObj.createQiusong = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.createQiusong,
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

        return qiusongEntryServiceObj;
    }]);