/**
 * Created by 53983 on 2017/5/16.
 */
goceanApp.factory('qiusongSharedService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope,ajaxUtil,appSettings) {
        var qiusongSharedServiceObj = {};
        /*给服务对象注册方法*/
        //获得分享求送详情
        qiusongSharedServiceObj.getDetails = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.getQiusongDetailSponsor,
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
        return qiusongSharedServiceObj;
    }]);