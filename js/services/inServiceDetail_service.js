/**
 * Created by 53983 on 2017/3/17.
 */
/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.factory('inServiceDetailService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var inServiceDetailServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单详情
        inServiceDetailServiceObj.getServiceOrderDetail = function (params) {
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
        return inServiceDetailServiceObj;
    }]);