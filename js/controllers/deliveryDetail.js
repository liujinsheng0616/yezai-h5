/**
 * Created by 53983 on 2017/3/19.
 */
goceanApp.controller('DeliverDetailCtrl',function ($scope, $rootScope, $state, $stateParams, $filter, $upload, deliverDetailService,normalDetailService, configService, localStorageService,appSettings) {
    console.log('about DeliverDetailCtrl');

    $scope.passport = localStorageService.get("passport");
    if ($stateParams.orderId){
        $scope.orderId = $stateParams.orderId;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
        $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $imageFiless = $("#imageFiles"),
        buyerFilesNum = 1;

    var obj = {
        passportId:$scope.passport.passportId,
        token:$scope.passport.token,
        orderId:$scope.orderId
    };

    deliverDetailService.getForwardDetails(obj).then(function(data){
        console.log(data);
        if ("OK" == data.status){
            var forwardDetailsDto = data.result;
            onReady(forwardDetailsDto);
        }
    },function(err){

    });

    function onReady(forwardDetailsDto) {

        $scope.forwardDetailsDto = forwardDetailsDto;

        initPic(forwardDetailsDto.orderExt);
    }

    function initPic(orderExt) {
        // 卖家图片
        if (orderExt) {
            var files = orderExt.sellerPic;
            if (files != null && files != "undefined") {
                for (var i = 0, len = files.length; i < len; ++i) {
                    var file = appSettings.img_domain+files[i];
                    $imageFiless.append($(tmpl.replace('#url#', file)));
                }
            }

            // 买家图片
            files = orderExt.buyerPic;
            if (files != null && files != "undefined") {
                for (var i = 0, len = files.length; i < len; ++i) {
                    var file = appSettings.img_domain+files[i];
                    $imageFiless.append($(tmpl.replace('#url#', file)));
                }
            }
        }
    }

    $scope.getExpressInfo = function (expressBrief) {

        alert("查询快递单号");

    }

    $uploaderInput.on("change", function(e){
        var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
        var config = {
            api: 'http://v0.api.upyun.com/',
            bucket: 'topic-photo-test',
            // 空间的表单 API
            form_api: 'tgQBgP/ltnhbv2bHSPy4blIwcws='
        };
        console.log(buyerFilesNum)
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
                    orderId:$scope.orderId,
                    url:data.url
                };
                deliverDetailService.onPicUploaded(obj).then(function(data){
                    console.log(data);
                    if ("OK" == data.status){
                        buyerFilesNum++;
                        // 文件上传成功处理函数 http://topic-photo-test.b0.upaiyun.com/
                        //$imageFiless.append($(tmpl.replace('#url#', 'http://topic-photo-test.b0.upaiyun.com/' + data.url)));
                        $imageFiless.append($(tmpl.replace('#url#', appSettings.img_domain + obj.url)));
                    }
                },function(err){

                });

            }).error(function(data, status, headers, config) {
                //失败处理函数
                console.log('上传失败');
            });
        }
    });


    $imageFiless.on("click", "li", function(){
        $galleryImg.attr("style", this.getAttribute("style"));
        $gallery.fadeIn(100);
    });
    $gallery.on("click", function(){
        $gallery.fadeOut(100);
    });
    
    // 晒晒
    $scope.goPublish = function () {
        $.prompt("", "发布到晒晒", function(text) {
            // 发布
            var obj = {
                passportId:$scope.passport.passportId,
                token:$scope.passport.token,
                orderId:$scope.orderId,
                text:text
            }

            normalDetailService.goShaishai(obj).then(function(data){
                console.log(data);
                if ("OK" == data.status){
                    $state.go("main.home");
                }
            },function(err){

            });

        }, function() {
            //取消操作
        });
    }
});