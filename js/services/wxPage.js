/**
 * Created by kingson·liu on 2017/3/12.
 */
goceanApp.factory('wxBaseService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope, ajaxUtil,appSettings) {
        var passportObj = {};
        /*给服务对象注册方法*/
        //获得收获地址数据
        var url =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        appSettings.appId +
        "&redirect_uri=" +
        appSettings.host2 + appSettings.requestURL.wxBase +
        "&response_type=code&scope=snsapi_base&state=";
        passportObj.getBase = function (state) {
            var defer = $q.defer();
            var obj = {
                // url:appSettings.host2+appSettings.requestURL.wxBase,
                url:url + state + "&connect_redirect=1#wechat_redirect",
                type:'GET',
                dataType: 'JSONP'
            }
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);
            },function(err){
                defer.reject(err);
            })
            return defer.promise;
        };
        return passportObj;
    }]);

goceanApp.factory('wxUserInfoService', ['$http', '$q','$rootScope', 'ajaxUtil','appSettings',
    function ($http, $q, $rootScope, ajaxUtil,appSettings) {
        var passportObj = {};
        /*给服务对象注册方法*/
        //获得收获地址数据
        var url =  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            appSettings.appId +
            "&redirect_uri=" +
            appSettings.host2 + appSettings.requestURL.wxUserInfo +
            "&response_type=code&scope=snsapi_userinfo&state=";
        passportObj.getUserInfo = function (state) {
            var defer = $q.defer();
            var obj = {
                // url:appSettings.host2+appSettings.requestURL.wxBase,
                url:url + state + "&connect_redirect=1#wechat_redirect",
                type:'GET',
                dataType: 'JSONP'
            }
            ajaxUtil.ajax(obj).then(function(data){
                defer.resolve(data);
            },function(err){
                defer.reject(err);
            })
            return defer.promise;
        };
        return passportObj;
    }]);