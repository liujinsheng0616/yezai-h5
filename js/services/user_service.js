/**
 * Created by kingson·liu on 15-6-21.
 */
goceanApp.factory('userService', ['$http', '$q',
    function ($http, $q) {
        var userServiceObj = {};
        /*给服务对象注册方法*/
        //登录
        userServiceObj.getUser = function (user) {
            /*var defer = $q.defer();
            $http.post(strBuff.toString(), credential)
                .success(
                function (data) {
                    if (data && data.length > 0) {
                        userInfo.UserId = data[0].UserId;
                        userInfo.UserName = data[0].UserName;
                        userInfo.Mobile = data[0].Mobile;
                        userInfo.Email = data[0].Email;
                        defer.resolve(data[0]);
                    } else {
                        defer.resolve(data);
                    }
                }).error(function (err) {
                    defer.resolve(err);
                });

            return defer.promise;*/
            return {a:1,b:2};
        };

        return userServiceObj;
    }]);
