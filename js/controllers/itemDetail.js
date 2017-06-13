/**
 * Created by 53983 on 2017/3/22.
 */
goceanApp.controller('ItemDetailCtrl', function($scope, $rootScope, $state, $timeout, $stateParams, appSettings,mallDetailService, mainHomeService, configService, localStorageService) {
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

    var goodsId = 0;
    var sharerId = 0;
    if ($stateParams.goodsId){
        goodsId = $stateParams.goodsId;
    }
    if ($stateParams.sharerIdStr){
    	var sharerIdStr = $stateParams.sharerIdStr;
        sharerIdStr = sharerIdStr.replace("sharerId_","");
        sharerId = parseInt(sharerIdStr);
    }

    var _state = "itemDetail";
    if ($scope.passport == null){

        // if (goodsId == 0 || sharerId ==0) {
        //     window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/base&response_type=code&scope=snsapi_base&state=" + _state;
        //     return;
        // }else{
            window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0cae6e3b9632e632&redirect_uri=http://wxsdk.yezaigou.com/wx/page/shared/"
			+ goodsId + "/sharerId_" + sharerId +
			"&response_type=code&scope=snsapi_userinfo&state="+_state;
            return;
		// }
    }
    var thisUrl = appSettings.domain + "/index.html#/itemShared";
    thisUrl = thisUrl + "/" + goodsId;
    thisUrl = thisUrl + "/sharerId_" + $scope.passport.passportId;

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);

    var itemDetail = null;
	if ($rootScope.itemDetail && $rootScope.itemDetail.goodsId == goodsId){
    	init();
	}else{
    	var obj = {
    		goodsId:goodsId
		};
        mallDetailService.getMallDetail(obj).then(function(data){
            if (data.status == "OK"){
                $rootScope.itemDetail = data.result;
                init();
            }

        },function(err){

        });
	}

	function init() {

        itemDetail = $rootScope.itemDetail;

        itemDetail.viewPrice = "￥" + itemDetail.minPrice + "~"
            + itemDetail.maxPrice;

        if (!$rootScope.type) {
            $rootScope.type = $stateParams.type;
        }

        setTimeout(function () {

        	// 设置分享
            wx.ready(function() {
                wx.checkJsApi({
                    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        wx.showOptionMenu();
                        //分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: $scope.passport.nickName + '也在购买: ' + itemDetail.title, // 分享标题
                            link: thisUrl, // 分享链接
                            imgUrl: 'http://static.yezaigou.com/' + itemDetail.thumbnail, // 分享图标
                            success: function () {

                            },
                            cancel: function () {

                            }
                        });

                        //分享给朋友
                        wx.onMenuShareAppMessage({
                            title: $scope.passport.nickName + '也在购买: ' + itemDetail.title, // 分享标题
                            desc: itemDetail.description, // 分享描述
                            link: thisUrl, // 分享链接
                            imgUrl: 'http://static.yezaigou.com/' + itemDetail.thumbnail, // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {

                            },
                            cancel: function () {

                            }
                        });
                    }
                });
            });

            // 设置sku高度
            if (!($scope.itemDetail == null || $scope.itemDetail == "undefined")) {
                for (var i = 0; i < $scope.itemDetail.skuPropertyList.length; i++) {
                    var sku = $scope.itemDetail.skuPropertyList[i];
                    var count = Math.ceil(sku.eleList.length / 3);
                    $("#skuEle" + i).css({
                        "padding-top": 0,
                        "height": (count * 65) + "px"
                    });
                    for (var j = 0; j < sku.eleList.length; j++) {
                        var ele = sku.eleList[j];
                        if (j % 3 == 0) {
                            $("#" + sku.id + "" + j).removeClass().addClass(
                                "weui_sku_spanFirst");
                        }
                    }
                }
            }
            // 图片自动轮播
            $('#slide2').swipeSlide(
                {
                    autoSwipe: true,// 自动切换默认是
                    speed: 3000,// 速度默认4000
                    continuousScroll: true,// 默认否
                    transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',// 过渡动画linear/ease/ease-in/ease-out/ease-in-out/cubic-bezier
                    lazyLoad: true,// 懒加载默认否
                    firstCallback: function (i, sum, me) {
                        me.find('.dot').children().first().addClass('cur');
                    },
                    callback: function (i, sum, me) {
                        me.find('.dot').children().eq(i).addClass('cur')
                            .siblings().removeClass('cur');
                    }
                });
        }, 10);
    }
	// var gallery = $("#gallery"), galleryImg = $("#galleryImg");
	// $scope.preview = function(index) {
	// 	galleryImg.attr("style", "background-image:url("
	// 			+ $("#img" + index).attr("src") + ")");
	// 	gallery.fadeIn(100);
	// };
	// gallery.on("click", function() {
	// 	gallery.fadeOut(100);
	// });

    // 预览图片
    $scope.previewImage = function(index){

        var pics = [];
        for (i in itemDetail.slidePic){
            pics[i] = appSettings.domain + "/" + itemDetail.slidePic[i];
        }
        // 测试代码
        wx.ready(function() {
            wx.previewImage({
                current: pics[index], // 当前显示图片的http链接
                urls: pics // 需要预览的图片http链接列表
            });
        });
    };

	var _payDescription = "";
	var _payAttachment = [];

	var _skuId = 0;
	var _totalPrice = 0;
	var _price = 0;
	var _attachedGoodsList = [];
	var _minPrice = 0;
	var _maxPrice = 0;
	// 选择商品
	$scope.chooseSku = function($event, ele, type) {
		// 改变选中状态
		$($event.target).addClass("weui_sku_spanActive");
		$($event.target).siblings("div").each(function() {
			$(this).removeClass("weui_sku_spanActive");
		});
		// 遍历当前skuPropertyList

		var skuPropertyList = null; // goods.skuPropertyList;
		var skuList = null;// goods.skuList;
		var isSelected = 0;
		var attachGoods = null;
		var isAttached = (type == 'attachment');
		if (isAttached) {
			if (_attachedGoodsList.length == 0) {// 初始化价格
				_attachedGoodsList = itemDetail.attachment.list;
				for (k in _attachedGoodsList) {
					_attachedGoodsList[k].price = 0;
					_attachedGoodsList[k].payDescription = "";
				}
			}
		}
		if (isAttached) {
			var goodsList = itemDetail.attachment.list;
			for (k in goodsList) {
				attachGoods = goodsList[k];
				skuPropertyList = attachGoods.skuPropertyList; // OK attachment
				skuList = attachGoods.skuList; // OK attachment
				var isGot = false;
				for (m in eleList) {
					var element = eleList[m];
					if (ele.id = element.id) {
						isGot = true;
						attachGoods.payDescription += (ele.value + " ");
						break;
					}
				}
				if (isGot) {
					break;
				}
			}
		} else {
			// 遍历主商品,改变selected字段值
			skuPropertyList = itemDetail.skuPropertyList; // OK goods
			skuList = itemDetail.skuList; // OK goods
		}

		var eleSelected = [];
		for (i in skuPropertyList) {
			var skuProperty = skuPropertyList[i];
			if (ele.pid == skuProperty.id) {
				var eleList = skuProperty.eleList;
				for (j in eleList) {
					var element = eleList[j];
					if (element.id == ele.id) {
						if (isAttached) {// 附件可以从选中状态到不选中状态
							if (element.isSelected == 1) {
								element.isSelected = 0;
							} else {
								element.isSelected = 1;
								isSelected = 1;
							}
						} else {
							element.isSelected = 1
						}
					} else {
						element.isSelected = 0;
					}
				}
				break;
			}
		}

		var resultSkuList = [];

		_payDescription = "";
		var isContinue = !isAttached || isSelected;
		if (isContinue) {
			// 取出所有的select ele
			for (i in skuPropertyList) {
				var skuProperty = skuPropertyList[i];
				var eleList = skuProperty.eleList;
				for (j in eleList) {
					var tempEle = eleList[j];
					if (tempEle.isSelected == 1) {
						eleSelected.push(tempEle.skuList);
						
						/*
						 * _payDescription
						 */
						_payDescription = _payDescription + skuProperty.name +":" + tempEle.value + " " 
					}
				}
				
				
			}

			// 找出skuId
			if (eleSelected.length > 0) {

				var tempList = eleSelected[0];
				eleSelected = eleSelected.splice(1, eleSelected.length - 1);
				for (i in tempList) {
					var tempSkuId = tempList[i];// [1,2]
					var flagA = 1;
					for (j in eleSelected) {
						var flagB = 0;
						var skuListSelected = eleSelected[j];
						for (k in skuListSelected) {
							var skuId = skuListSelected[k];
							if (skuId == tempSkuId) {
								flagB = 1;
								break;
							}
						}
						if (flagB == 0) {
							flagA = 0;
							break;
						}
					}
					if (flagA == 1) {
						resultSkuList.push(tempSkuId);
					}
				}
				if (resultSkuList.length == 1) {
                    if (isAttached) {
                        attachGoods.skuId = resultSkuList[0];
                    } else {
                    	_skuId = resultSkuList[0];
               		 }
				}
				// 最小价格，最大价格
				var minPrice = 0, maxPrice = 0;
				if (resultSkuList.length > 0) {
					for (i in resultSkuList) {
						var tempSkuId = resultSkuList[i];
						for (j in skuList) {//和sku列表比较
							var sku = skuList[j];
							var skuId = sku.skuId;
							var price = sku.price;
							if (tempSkuId == skuId) {
								if (minPrice == 0) {
									minPrice = price;
								} else {
									minPrice = Math.min(minPrice, price);
								}
								if (maxPrice == 0) {
									maxPrice = price;
								} else {
									maxPrice = Math.max(maxPrice, price);
								}

								break;
							}
						}
					}

				}

				if (isAttached) {
					if (isSelected) {
						if (minPrice == maxPrice) {// 选中sku
							attachGoods.price = minPrice;
						}
					} else {// 取消
						attachGoods.price = 0;
					}
				} else {
					_minPrice = minPrice;
					_maxPrice = maxPrice;
				}
				// 要显示价格
				if (_minPrice < _maxPrice) {
					itemDetail.viewPrice = "￥" + itemDetail.minPrice + "~"
							+ itemDetail.maxPrice;
				} else {
					_price = _minPrice;
					_totalPrice = _price;
					if (isAttached) {
						_payAttachment = [];
						for (n in _attachedGoodsList) {
							var att = _attachedGoodsList[n]
							_totalPrice += att.price;
							/*
							 * _payAttachment
							 */
							if (att.price == 0) {
                                var simpleAtt = {
                                    skuId: att.skuId,
                                    payDescription: att.title + " " + att.payDescription,
                                    price: att.price
                                };
                                _payAttachment.push(simpleAtt);
                            }
						}
					}
					itemDetail.viewPrice = "￥" + _totalPrice;
				}
			}
		}
	};

	// 购买页
	$scope.toPayment = function() {
		if (_price == 0) {
			$.alert("请选择主商品");
			return;
		}
		$rootScope.payView = null;
		$rootScope.orderRo = null;
		$state.go("payment", {
			goodsId:itemDetail.goodsId,
			skuId:_skuId,
			title : itemDetail.title,
			payDescription : _payDescription,
			price : _totalPrice,
			thumbnail : itemDetail.thumbnail,
			type : itemDetail.type,
			payAttachment:_payAttachment,
			sharerId:sharerId
		})
	};

    // 购买页
    $scope.toQiusong = function() {
        if (_price == 0) {
            $.alert("请选择主商品");
            return;
        }
        $rootScope.payView = null;
        $rootScope.orderRo = null;
        $state.go("qiusongEntry", {
            itemId:_skuId
        })
    }
});
