/**
 * Created by 53983 on 2017/5/27.
 */
goceanApp.factory('dealDetailService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope, ajaxUtil,appSettings) {
        var dealDetailServiceObj = {};
        /*给服务对象注册方法*/
        //获得交易明细
        dealDetailServiceObj.dealDetailList = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.dealDetailList,
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
        return dealDetailServiceObj;
    }
]);