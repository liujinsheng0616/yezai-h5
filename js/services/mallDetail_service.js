/**
 * Created by 53983 on 2017/3/22.
 */
goceanApp.factory('mallDetailService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var mallDetailServiceObj = {};
        /*给服务对象注册方法*/
        //获得商品详情
        mallDetailServiceObj.getMallDetail = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.item_details,
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


        return mallDetailServiceObj;
    }]);