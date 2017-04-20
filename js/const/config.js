/**
 * Created by kingson·liu on 2017/3/9.
 */
goceanApp.factory('configService',['$http','$q','$timeout','appSettings',function($http,$q,$timeout,appSettings) {
    return {
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
}]);
