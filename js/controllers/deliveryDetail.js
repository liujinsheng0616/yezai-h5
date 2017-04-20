/**
 * Created by 53983 on 2017/3/19.
 */
goceanApp.controller('DeliverDetailCtrl',['$scope', '$rootScope','$state', '$stateParams', '$filter', '$upload', 'deliverDetailService', function ($scope, $rootScope, $state, $stateParams, $filter, $upload, deliverDetailService) {
    console.log('about DeliverDetailCtrl');

    $scope.detail.buyerPhoto = [];

    if (!$rootScope.status){
        $rootScope.status=$stateParams.status;
    }
    // 数据绑定
    var obj = {orderId:$stateParams.orderId,forwardId:$stateParams.forwardId};
    deliverDetailService.getDeliverDetailInfo(obj).then(function(data){
        console.log(data);
    },function(err){

    });
    // 数据操作
    $scope.detail = store.servingDetails;
    var dayOfWeek= $scope.detail.dayOfWeek;
    if (dayOfWeek == 1){
        $scope.detail.day = '日';
    } else if (dayOfWeek == 2){
        $scope.detail.day = '一';
    } else if (dayOfWeek == 3){
        $scope.detail.day = '二';
    } else if (dayOfWeek == 4){
        $scope.detail.day = '三';
    } else if (dayOfWeek == 5){
        $scope.detail.day = '四';
    } else if (dayOfWeek == 6){
        $scope.detail.day = '五';
    } else if (dayOfWeek == 7){
        $scope.detail.day = '六';
    }
    $scope.detail.sendDate = $filter('date')(new Date(new Date($scope.detail.deliveryDay).getTime() - 24*1*60*60*1000),'yyyy-MM-dd');
    
    // 查询快递
    $scope.getExpressInfo = function () {
        $.alert("敬请期待物流信息");
    };

    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
        $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $imageFiless = $("#imageFiles"),
        buyerFilesNum = 1;

    // 卖家图片
    if ($scope.detail.sellerPhoto.length > 0){
        var files = $scope.detail.sellerPhoto;
        for (var i = 0, len = files.length; i < len; ++i) {
            var file = files[i];
            $imageFiless.append($(tmpl.replace('#url#', file)));
        }
    }

    // 卖家图片
    if ($scope.detail.buyerPhoto && $scope.detail.buyerPhoto.length > 0){
        var files = $scope.detail.buyerPhoto;
        for (var i = 0, len = files.length; i < len; ++i) {
            var file = files[i];
            $imageFiless.append($(tmpl.replace('#url#', file)));
        }
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
                buyerFilesNum++;
                // 文件上传成功处理函数 http://topic-photo-test.b0.upaiyun.com/
                $imageFiless.append($(tmpl.replace('#url#', 'http://topic-photo-test.b0.upaiyun.com/' + data.url)));
                $scope.detail.buyerPhoto.push('http://topic-photo-test.b0.upaiyun.com/' + data.url);
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

}]);

