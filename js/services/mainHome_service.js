/**
 * Created by Kingsong·liu on 2017/3/11.
 */
goceanApp.factory('mainHomeService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope, ajaxUtil,appSettings) {
        var mainHomeServiceObj = {};
        /*给服务对象注册方法*/
        //获得订单列表
        mainHomeServiceObj.listTopic = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.listTopic,
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

        /*
         *  删除贴子
         * {passportId:1,
         *  token:"xxxxx",
         * topicId: 1}
         */
        mainHomeServiceObj.removeTopic = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.likes,
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

        /*
         * 点赞，取消赞
         * {passportId:1,
         *  token:"xxxxx",
         * topicId: 1}
         */
        mainHomeServiceObj.likes = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.likes,
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
        /*
         *  回复
         *  {
         *  passportId:1,
         *  token:"xxxxx",
         *  topicId:1,
         *  toId:1 //0代表回复发帖人
         *  text:"ddeeedsssssssssss"
         */
        mainHomeServiceObj.createFollow = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.createFollow,
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

        /*
         * 删除回复
         * {
         *  passportId:1,
         *  token:"ddddd",
         *  followId:1 //回复的ID
         *  }
         */
        mainHomeServiceObj.removeFollow = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.removeFollow,
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

        mainHomeServiceObj.getJssdkInfo = function (params) {
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

        /*
         * 删除自己的状态
         * */
        mainHomeServiceObj.deleteOwnTopic = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.removeTopic,
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

        /*
         * 加载更多的回复评论
         * */
        mainHomeServiceObj.loadMoreListFollow = function (params) {
            var defer = $q.defer();
            var obj = {
                url:appSettings.host+appSettings.requestURL.listFollow,
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

        return mainHomeServiceObj;
    }]);