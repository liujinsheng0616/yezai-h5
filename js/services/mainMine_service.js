/**
 * Created by kingson·liu on 2017/3/12.
 */
goceanApp.factory('mainMineService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {

        var mainMineServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单列表
        mainMineServiceObj.getMyInfo = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.urlOne,
                type:'GET',
                params:params
            }
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);

            },function(err){
                defer.reject(err);
            })
            return defer.promise;
        };

        return mainMineServiceObj;
    }]);
