/**
 * Created by kingson·liu on 2017/3/9.
 */
function Config($location,$rootScope,dataSource) {
    this.location = $location;
    this.scope = $rootScope;
    this.dataSource = dataSource;

    // 查询订单list
    this.getOrderListByType_href = "";
}

Config.prototype= {
    constructor: Config,
    //获取URL参数
    parseQueryString: function (url) {
        var params = {};
        url = decodeURI(url);
        var arr = url.split("?");
        if (arr.length <= 1)
            return params;
        arr = arr[1].split("&");
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i]) {
                var a = arr[i].split("=");
                if (a && a.length > 1) {
                    if (a[1].indexOf('#') >= 0) {
                        var hash = a[1].split("#");
                        params[a[0]] = hash[0];
                        params['hash'] = hash[1];
                    } else {
                        params[a[0]] = a[1];
                    }
                }

            }
        }
        return params;
    }
};

try{
    var configModule = angular.module('config',[]);
    configModule.factory('configService',['$location','$rootScope',function($location,$rootScope,dataSource) {
        return new Config($location,$rootScope,dataSource);
    }])
}catch(e){
}