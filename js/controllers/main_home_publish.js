/**
 * Created by 53983 on 2017/4/12.
 */
goceanApp.controller('MainHomePublishCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, $upload, mallHomePublishService,topicCreationService, configService, localStorageService, appSettings) {
    console.log('about MainHomePublishCtrl');

    $scope.passport = localStorageService.get("passport");
    $rootScope.tagList = $stateParams.tagList;


    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#);border:1px solid #d9d9d9;"></li>',
        $uploaderInput = $("#uploaderInput"),
        $imageFiless = $("#imageFiles")

    $scope.hasUploadNum = 0;
    $scope.photoList = [];
    $uploaderInput.on("change", function(e){
        var files = e.target.files;
        var config = {
            api: 'http://v0.api.upyun.com/',
            bucket: 'topic-photo-test',
            // 空间的表单 API
            form_api: 'tgQBgP/ltnhbv2bHSPy4blIwcws='
        };

        if ($scope.hasUploadNum > 9 || files.length > 9) {
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
                $scope.hasUploadNum++;
                $imageFiless.append($(tmpl.replace('#url#', appSettings.img_domain + data.url)));
                $scope.photoList.push(appSettings.img_domain + data.url);
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
            photoList:$scope.photoList,//["xxx.jpg","zzz.jpg"]
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
    }
});