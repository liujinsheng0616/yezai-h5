/**
 * Created by 53983 on 2017/3/19.
 */
goceanApp.factory('deliverDetailService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var deliverDetailServiceObj = {};
        /*给服务对象注册方法*/
        //顺延下一次发货时间
        deliverDetailServiceObj.getDeliverDetailInfo = function (params) {
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
        return deliverDetailServiceObj;
    }]);