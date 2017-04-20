/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.factory('mallService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var mallListServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单列表
        mallListServiceObj.getMallList = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.item_listItem,
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

        return mallListServiceObj;
    }]);