/**
 * Created by 53983 on 2017/3/27.
 */
goceanApp.factory('normalDetailService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var normalDetailServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单列表
        normalDetailServiceObj.getNormalDetail = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.urlOne,
                type:'GET',
                params:params
            };
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);
            },function(err){
                defer.reject(err);
            });
            return defer.promise;
        };

        return normalDetailServiceObj;
    }]);