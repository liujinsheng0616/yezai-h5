/**
 * Created by 53983 on 2017/4/12.
 */
goceanApp.controller('MainHomePublishCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, mallHomePublishService,topicCreationService, configService) {
    console.log('about MainHomePublishCtrl');

    $rootScope.tagList = $stateParams.tagList;


    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    var images = {
        localId: [],
        serverId: []
    };
    var hasChoosedNum = 0;
    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>';
    // 选择图片
    $scope.addImage=function(){
        wx.ready(function() {
            wx.chooseImage({
                count: 9 - hasChoosedNum, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    hasChoosedNum += res.localIds.length;
                    for (i in res.localIds){
                        images.localId.push(res.localIds[i]);
                        $('#imageFiles').append($(tmpl.replace('#url#', res.localIds[i])))

                        $rootScope.localImgIds.push(res.localIds[i]); //TEST
                        upload();//TEST
                    }
                    if (hasChoosedNum == 9){
                        $('.weui-uploader__input-box').hide();
                    }
                }
            });
        });
    };

    $rootScope.tagChoosed = [];
    $rootScope.isToCreateTopic = false;
    $rootScope.localImgIds = [];
    $rootScope.serverImgIds = [];
    $scope.topic = {};
    $scope.topic.text = "";
    $rootScope.topic = $scope.topic;

    function removeAndGetLocalId(){
        if ($rootScope.localImgIds.length > 0){
            var localId = $rootScope.localImgIds[0];
            $rootScope.localImgIds = $rootScope.localImgIds.slice(1);//去掉第一个
            return localId;
        }
        return null;
    };

    function createTopic(){
        if ($rootScope.passport == null || $rootScope.passport == "undefined"){// base , userInfo
            // 登录 FIXME
        }
        //AJAX请求服务器
        var topic = {
            type:$rootScope.topicViewNavId,// SHAI_SHAI | INTEREST
            tagList:$rootScope.tagChoosed,//[1,2]
            text:$scope.topic.text,//发帖内容 FIXME
            photoList:$rootScope.serverImgIds,//["xxx.jpg","zzz.jpg"]
            postAddress:"",//地址
            coordinate:"",
            passportId:$rootScope.passport.passportId,//groupId
            token:$rootScope.passport.token,//登录后的我们自己的token
            device:"WX"// WX | ANDROID | IOS | PC
        };

        topicCreationService.createTopic(topic);

        // $state.go('main.home');
    }

    /*
     * 选取后就调用此方法，
     * 发布时,$rootScope.isToCreateTopic = true; 然后调用此方法
     */
    $rootScope.isUploading = false;
    function upload (){
        if ($rootScope.isUploading)
            return;
        var localId = removeAndGetLocalId();
        if (localId == null) {
            if ($rootScope.isToCreateTopic){
                /*
                 * createTopic
                 */
                createTopic();
            }
            return;
        }
        $rootScope.isUploading = true;
        wx.ready(function() {
            wx.uploadImage({
                localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    console.log("serverId = " + serverId);
                    $rootScope.serverImgIds.push(serverId);
                    $rootScope.isUploading = false;
                    upload();//递归
                }
            });
        });
    }

    // 预览图片
    $scope.previewImage = function(){
        // 测试代码
        wx.ready(function() {
            wx.previewImage({
                current: images.localId[0], // 当前显示图片的http链接
                urls: images.localId // 需要预览的图片http链接列表
            });
        });
    };

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

        upload();

        $state.go('main.home'); //直接跳到论坛页面，FIXME 把数据带过去显示
    }
});