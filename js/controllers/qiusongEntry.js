/**
 * Created by 53983 on 2017/3/14.
 */
goceanApp.controller('QiusongEntryCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, qiusongEntryService, configService, localStorageService) {
    console.log("about QiusongEntryCtrl");

    var url = window.location.href;
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

    var skuId = 0;//这里和购买不一样，做服务端要特殊处理，先获得goodsId
    var sharerId = 0;
    if ($stateParams.itemId){
        skuId = $stateParams.itemId;
    }

    if (skuId == 0) {
        $.alert("没有此求送商品,id = " + skuId);
        return;
    }

    if ($stateParams.sharerId){
        sharerId = $stateParams.sharerId;
    }
    var _state = "qiusongEntry/" + skuId+"/"+sharerId;//FIXME 登录后返回当前页面，需要参数skuId
    if ($scope.passport == null){//如果是基础用户，这里不要求授权用户信息; 若果没登录，就直接通过授权模式登录
        window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/userInfo&response_type=code&scope=snsapi_userinfo&state="+_state;
        return;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    // function upDownOperation(element)
    // {
    //     var _input = element.parent().find('input'),
    //         _value = _input.val(),
    //         _step = _input.attr('data-step') || 1;
    //     //检测当前操作的元素是否有disabled，有则去除
    //     element.hasClass('disabled') && element.removeClass('disabled');
    //     //检测当前操作的元素是否是操作的添加按钮（.input-num-up）‘是’ 则为加操作，‘否’ 则为减操作
    //     if ( element.hasClass('weui-number-plus') )
    //     {
    //         var _new_value = parseInt( parseFloat(_value) + parseFloat(_step) ),
    //             _max = _input.attr('data-max') || false,
    //             _down = element.parent().find('.weui-number-sub');
    //
    //         //若执行‘加’操作且‘减’按钮存在class='disabled'的话，则移除‘减’操作按钮的class 'disabled'
    //         _down.hasClass('disabled') && _down.removeClass('disabled');
    //         if (_max && _new_value >= _max) {
    //             _new_value = _max;
    //             element.addClass('disabled');
    //         }
    //     } else {
    //         var _new_value = parseInt( parseFloat(_value) - parseFloat(_step) ),
    //             _min = _input.attr('data-min') || false,
    //             _up = element.parent().find('.weui-number-plus');
    //         //若执行‘减’操作且‘加’按钮存在class='disabled'的话，则移除‘加’操作按钮的class 'disabled'
    //         _up.hasClass('disabled') && _up.removeClass('disabled');
    //         if (_min && _new_value <= _min) {
    //             _new_value = _min;
    //             element.addClass('disabled');
    //         }
    //     }
    //     _input.val( _new_value );
    // }
    //
    //
    // $('.weui-number-plus').click(function(){
    //     upDownOperation( $(this) );
    // });
    // $('.weui-number-sub').click(function(){
    //     upDownOperation( $(this) );
    // });

    $scope.subMember = function () {
        var qiusongRo = $scope.qiusongRo;
        if (qiusongRo.memberCount > 3) {
            qiusongRo.memberCount -= 1;
            qiusongRo.unitAmount = (qiusongRo.price + qiusongRo.memberCount/2 - 1 )/ qiusongRo.memberCount;
        }
    }

    $scope.plusMember = function () {
        var qiusongRo = $scope.qiusongRo;
        if (qiusongRo.memberCount < 10) {
            qiusongRo.memberCount += 1;
            qiusongRo.unitAmount = (qiusongRo.price + qiusongRo.memberCount/2 - 1 )/ qiusongRo.memberCount;
        }
    }

    function init () {

        var obj = {
            skuId: skuId
        };

        qiusongEntryService.getItemBrief(obj).then(function(data){
            if (data.status == "OK") {
                var itemBrief = data.result;
                $scope.qiusongRo = itemBrief;
                var qiusongRo = $scope.qiusongRo;
                qiusongRo.memberCount = 3;
                qiusongRo.unitAmount = (qiusongRo.price + qiusongRo.memberCount/2 - 1 )/ qiusongRo.memberCount;
            }else{
                $.alert("系统繁忙,请稍候再试");
            }
        },function(err){
            $.alert("系统繁忙,请稍候再试");
        });

    };



    $scope.create = function () {


            var obj = {//为了以后扩展用户自创建，而统一请求数据, itemId ==0
                passportId:$scope.passport.passportId,
                token:$scope.passport.token,
                itemId:$scope.qiusongRo.id,
                price:$scope.qiusongRo.price,
                memberCount:$scope.qiusongRo.memberCount,//必要
                title:$scope.qiusongRo.title,
                thumbnail:$scope.qiusongRo.thumbnail,
                payDescription:$scope.qiusongRo.payDescriptio
            };

        qiusongEntryService.createQiusong(obj).then(function(data){
            if (data.status == "OK") {
                var id = data.result;
                $state.go("qiusongDetailsSponsor", {
                    id: id
                });
            }else{
                $.alert("系统繁忙,请稍候再试");
            }
        },function(err){
            $.alert("系统繁忙,请稍候再试");
        });
    };

    init();
});
