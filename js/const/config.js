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
            if (!(params.icon == "undefined" || params.icon == null || params == "")){
                params.icon = params.icon.replace(/%2F/g, "/");
            }
            return params;
        },
        // 隐藏右上角功能
        hideWXBtn: function(){
            if(!wx){
                return;
            }

            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wx0cae6e3b9632e632', // 必填，公众号的唯一标识
                timestamp: '1505281356', // 必填，生成签名的时间戳
                nonceStr: '123', // 必填，生成签名的随机串
                signature: 'sM4AOVdWfPE4DxkXGEs8VFjm_U0ppfoGtzD4w-Nr96E2sfgFJT-ZSg-LwZpdSiP5BzN-Ec8XaGKggVL0tgYO7w',// 必填，签名，见附录1
                jsApiList: ['hideOptionMenu', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function () {
                // 判断当前客户端版本是否支持指定JS接口
                wx.checkJsApi({
                    jsApiList: ['hideOptionMenu', 'hideAllNonBaseMenuItem'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    }
                });
            });
            wx.hideOptionMenu();
        }
    };
}]);
