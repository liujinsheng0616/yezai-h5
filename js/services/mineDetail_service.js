/**
 * Created by 53983 on 2017/5/27.
 */
goceanApp.factory('mineDetailService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope, ajaxUtil,appSettings) {
        var mineDetailServiceObj = {};
        /*给服务对象注册方法*/
        //获得我的账户明细
        mineDetailServiceObj.mineDetailList = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.userData,
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

        mineDetailServiceObj.draw = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.draw,
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

        return mineDetailServiceObj;
    }
]);