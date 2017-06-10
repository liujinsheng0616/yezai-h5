/**
 * Created by 53983 on 2017/4/12.
 */
var photolist = [];
goceanApp.controller('MainHomePublishCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, $upload, mallHomePublishService,topicCreationService, configService, localStorageService, appSettings, $compile) {
    console.log('about MainHomePublishCtrl');

    $scope.passport = localStorageService.get("passport");
    $rootScope.tagList = $stateParams.tagList;


    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    var tmpl = '<li class="weui-uploader__file" style="position: relative;width: 85px;height: 85px;padding: 5px;">' +
            '<div style="border:1px solid #d9d9d9; width: 79px; height: 79px;"><img src="#url#" style="width: 100%;height: 100%;"/></div>' +
            '<span class="weui-badge" style="position: absolute;top: 0;right: -8px;background-color: #d9d9d9;" onclick="deletePhoto(imgUrl);">×</span></li>',
        $uploaderInput = $("#uploaderInput"),
        $imageFiless = $("#imageFiles");

    $scope.photoList = [];
    $uploaderInput.on("change", function(e){
        var files = e.target.files;
        var config = {
            api: 'http://v0.api.upyun.com/',
            bucket: 'topic-photo-test',
            // 空间的表单 API
            form_api: 'tgQBgP/ltnhbv2bHSPy4blIwcws='
        };

        if ($scope.photoList.length > 9) {
            $.alert("最多上传9张图片!");
            return;
        }
        for (var i = 0, len = files.length; i < len; ++i) {
            var file = files[i];
            var options = {
                bucket: config.bucket,
                expiration: Math.floor(new Date().getTime() / 1000) + 86400,
                'save-key': '/{year}/{mon}/{day}/{hour}_{min}_{sec}_{filename}{.suffix}'
            };
            var policy = Base64.encode(JSON.stringify(options));
            var signature = hex_md5(policy +'&'+ config.form_api);
            $scope.upload = $upload.upload({
                url: config.api+config.bucket, //上传的url
                method: 'POST',
                data: {
                    signature: signature,
                    policy: policy
                },
                file: file // or list of files ($files) for html5 only
            }).progress(function(evt) {//上传进度
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                $imageFiless.append(tmpl.replace('#url#', appSettings.img_domain + data.url).replace("imgUrl",  "'"+appSettings.img_domain + data.url+"'," + photolist.length));
                photolist.push(appSettings.img_domain + data.url);
            }).error(function(data, status, headers, config) {
                //失败处理函数
                console.log('上传失败');
            });
        }
    });

    $rootScope.tagChoosed = [];
    $rootScope.isToCreateTopic = false;
    $scope.topic = {};
    $scope.topic.text = "";
    $rootScope.topic = $scope.topic;

    function createTopic(){
        if ($scope.passport == null || $scope.passport == "undefined"){// base , userInfo
            // 登录 FIXME
        }
        //AJAX请求服务器
        var topic = {
            type:2,// SHAI_SHAI | INTEREST
            tagList:$rootScope.tagChoosed,//[1,2]
            text:$scope.topic.text,//发帖内容 FIXME
            photoList:photolist,//["xxx.jpg","zzz.jpg"]
            postAddress:"",//地址
            coordinate:"",
            passportId:$scope.passport.passportId,//groupId
            token:$scope.passport.token,//登录后的我们自己的token
            device:"WEB"// WX | ANDROID | IOS | PC
        };

        topicCreationService.createTopic(topic);

        // $state.go('main.home');
    }

    $imageFiless.on("click", "li", function(){
        // 测试代码
        wx.ready(function() {
            wx.previewImage({
                current: $scope.photoList[0], // 当前显示图片的http链接
                urls: $scope.photoList // 需要预览的图片http链接列表
            });
        });
    });

    // 取消发布
    $scope.cancelPublish = function () {
        $.confirm("您确定要退出吗?", "取消编辑", function() {
            $state.go('main.home');
        }, function() {
            //取消操作
        });
    };

    // 选择tag
    $scope.chooseTag = function ($event,tag) {
        if ($($event.target).hasClass('tagSelectActive')){
            $($event.target).removeClass('tagSelectActive');

            var temp = [];
            for (i in $rootScope.tagChoosed){
                if ($rootScope.tagChoosed[i] != tag){
                    temp.push(tag.id);
                }
            }
            $rootScope.tagChoosed = temp;

        } else {
            $($event.target).addClass('tagSelectActive');
            $rootScope.tagChoosed.push(tag.id);
        }
    };

    // 发布微贴
    $scope.publish = function () {
        if ($rootScope.isToCreateTopic)
            return;
        $rootScope.isToCreateTopic = true;
        createTopic();
        $rootScope.topicViewNavId = 2;//兴趣
        $state.go('main.home'); //直接跳到论坛页面，FIXME 把数据带过去显示
    };

});

// 删除照片
function deletePhoto(url, index) {
    $.confirm("您确定要删除吗?", "删除照片", function() {
        $("#imageFiles").find("li")[index-0].remove();
        photolist.splice($.inArray('url',photolist),1);
    }, function() {
        //取消操作
    });
}
