/**
 * Created by 53983 on 2017/4/12.
 */
goceanApp.factory('mallHomePublishService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope, ajaxUtil,appSettings) {
        var mallHomePublishServiceObj = {};
        /*给服务对象注册方法*/
        //获得当前页面JSSDK
        mallHomePublishServiceObj.getJssdkInfo = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host2+appSettings.requestURL.urlJssdk,
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
        return mallHomePublishServiceObj;
    }]);

goceanApp.factory('topicCreationService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope, ajaxUtil,appSettings) {
        var topicResult = {};
        /*给服务对象注册方法*/
        //获得当前页面JSSDK
        topicResult.createTopic = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.createTopic,
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
        return topicResult;
    }]);