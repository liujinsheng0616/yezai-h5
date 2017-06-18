/**
 * Created by 53983 on 2017/3/27.
 */
goceanApp.controller('NormalOrderDetailCtrl',function ($scope, $rootScope, $state, $stateParams, $filter, $upload, normalDetailService,deliverDetailService, configService, localStorageService,appSettings) {

   console.log("about NormalOrderDetailCtrl");

    var params = configService.parseQueryString(window.location.href);
    if (params.passportId){
        params.nickName = decodeURI(params.nickName);
        try {
            params.nickName = Base64.decode(params.nickName);
        }catch (e){
        }
        localStorageService.set("passport",params);
    }

    $scope.passport = localStorageService.get("passport");

    var orderId = 0;
    if($stateParams.orderId){
        orderId = $stateParams.orderId;
    }

    if ($scope.passport == null ){
        var _state = "normalDetail/"+orderId;
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state="+_state;
        return;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();
    $scope.hasImg = false;

    var tmpl = '<li class="weui-uploader__file" style="position: relative;width: 85px;height: 85px;padding: 5px;">' +
            '<div style=" width: 79px; height: 79px;"><img src="#url#" style="width: 100%;height: 100%;"/></div></li>',
        buyTmpl = '<li class="weui-uploader__file" style="position: relative;width: 85px;height: 85px;padding: 5px;">' +
            '<div style=" width: 79px; height: 79px;"><img src="#url#" style="width: 100%;height: 100%;" /></div>' +
            '<span class="weui-badge" style="position: absolute;top: 0;right: -8px;background-color: #d9d9d9;" url="imgUrl">×</span></li>',
        $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $imageFiless = $("#imageFiles"),
        buyerFilesNum = 1;

    var obj = {
        passportId:$scope.passport.passportId,
        token:$scope.passport.token,
        orderId:orderId
    };

    function refresh(orderId) {
        if (orderId <= 0)
            return;
        normalDetailService.getDetails(obj).then(function(data){
            console.log(data);
            if ("OK" == data.status){
                var orderDetailsDto = data.result;
                $rootScope.orderDetailsView = orderDetailsDto;
                $rootScope.orderDetailsView.isInited = true;
                initStatusView(orderDetailsDto);
                $imageFiless.empty();
                initPic(orderDetailsDto.orderExt);
            }
        },function(err){

        });
    }

    function initStatusView(orderDetailsView){

        if (orderDetailsView.status == 'ORDER_CREATED'){
            orderDetailsView.statusView = '未付款';
        }else if (orderDetailsView.status == 'ORDER_FINISHED'){
            orderDetailsView.statusView = '已完成';
        } else if (orderDetailsView.deliveryStatus == null){
            orderDetailsView.statusView = '待发货';
        } else if (orderDetailsView.deliveryStatus == 'DELIVERING'){
            orderDetailsView.statusView = '送货中';
        }else if (orderDetailsView.deliveryStatus == 'DELIVERED'){
            orderDetailsView.statusView = '已发货';
        }
    }

    var small = "!small";

    function initPic(orderExt) {
        // 卖家图片

        if (orderExt) {
            var files = orderExt.sellerPic;
            if (files != null && files != "undefined") {
                for (var i = 0, len = files.length; i < len; ++i) {
                    var file = appSettings.shaishai_domain+files[i] + small;
                    $imageFiless.append($(tmpl.replace('#url#', file)));
                    $scope.hasImg = true;
                }
            }

            // 买家图片
            files = orderExt.buyerPic;
            if (files != null && files != "undefined") {
                for (var i = 0, len = files.length; i < len; ++i) {
                    var file = appSettings.shaishai_domain+files[i] + small;
                    $imageFiless.append($(buyTmpl.replace('#url#', file).replace("imgUrl", files[i])));
                    $scope.hasImg = true;
                }
            }
        }
    }



    $scope.getExpressInfo = function (expressBrief) {

        alert("查询快递单号");

    };


    // 晒晒
    $scope.goPublish = function () {
        $.prompt("", "发布到晒晒", function(text) {
            // 发布
            var obj = {
                passportId:$scope.passport.passportId,
                token:$scope.passport.token,
                orderId:orderId,
                text:text
            };

            normalDetailService.goShaishai(obj).then(function(data){
                console.log(data);
                if ("OK" == data.status){
                    localStorageService.set("topicViewNavId",1);
                    $state.go("main.home");
                }
            },function(err){

            });

        }, function() {
            //取消操作
        });
    };

    $uploaderInput.on("change", function(e){
        var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
        var config = {
            api: 'http://v0.api.upyun.com/',
            bucket: 'shaishai',
            // 空间的表单 API
            form_api: 'hooVES61L17OyxkoxBlg3twa0m8='
        };
        if (buyerFilesNum > 6){
            $.alert("最多上传6张图片");
            $(".weui-uploader__input-box").hide();
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
                var obj = {
                    passportId:$scope.passport.passportId,
                    token:$scope.passport.token,
                    orderId:orderId,
                    url:data.url
                };
                deliverDetailService.onPicUploaded(obj).then(function(data){
                    if ("OK" == data.status){
                        buyerFilesNum++;
                        // 文件上传成功处理函数 http://topic-photo-test.b0.upaiyun.com/
                        //$imageFiless.append($(tmpl.replace('#url#', 'http://topic-photo-test.b0.upaiyun.com/' + data.url)));
                        $imageFiless.append($(buyTmpl.replace('#url#', appSettings.shaishai_domain + obj.url + small).replace("imgUrl",obj.url)));
                        $rootScope.orderDetailsView.orderExt.buyerPic.push(obj.url);
                        $scope.hasImg = true;
                    }
                },function(err){

                });

            }).error(function(data, status, headers, config) {
                //失败处理函数
                console.log('上传失败');
            });
        }
    });


    // 预览图片
    function previewImage(index){

        var pics = [];
        var sellerPic = $rootScope.orderDetailsView.orderExt.sellerPic;
        var buyerPic = $rootScope.orderDetailsView.orderExt.buyerPic;
        for(i in sellerPic){
            pics.push(appSettings.shaishai_domain+sellerPic[i]);
        }
        for (i in buyerPic){
            pics.push(appSettings.shaishai_domain+buyerPic[i]);
        }
        // 测试代码
        wx.ready(function() {
            wx.previewImage({
                current: pics[index], // 当前显示图片的http链接
                urls: pics // 需要预览的图片http链接列表
            });
        });
    };

    $imageFiless.on("click", "img", function(){
        previewImage(0);
    });

    $imageFiless.on('click', "span", function () {
        obj.url = this.getAttribute("url");
        deliverDetailService.deleteDetailPhoto(obj).then(function(data){
            if ("OK" == data.status){
                refresh(orderId);
            }
        },function(err){

        });
    });

    if ($rootScope.orderDetailsView == null) {
        refresh(orderId);
        return;
    }else if ($rootScope.orderDetailsView.isInited == false){
        $rootScope.orderDetailsView.isInited = true;
        initStatusView($rootScope.orderDetailsView);
        initPic($rootScope.orderDetailsView.orderExt);
        return;
    }




});