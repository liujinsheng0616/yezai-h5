/**
 * Created by 53983 on 2017/3/22.
 */
goceanApp.controller('MailDetailCtrl', function ($scope, $rootScope,$state, $timeout, $stateParams, mallDetailService, configService) {
    console.log("about MailDetailCtrl");

    var obj = {id:1};
    mallDetailService.getMallDetail(obj).then(function(data){
        console.log(data);
    },function(err){

    });

    if (!$rootScope.type){
        $rootScope.type = $stateParams.type;
    }

    // 获取JSSDK
    configService.getJssdkInfo(window.location.href);
    // 隐藏右上角
    configService.hideWXBtn();

    // 假数据映射
    if ($rootScope.type == "FORWARD"){
        $scope.mallDetail = store.item;
        $scope.skuList = store.item.skuList;
    } else if ($rootScope.type == 'NORMAL') {
        $scope.mallDetail = store.normalItem;
        $scope.skuList = store.normalItem.skuList;
    }
    setTimeout(function () {
        // 设置sku高度
        for (var i=0;i<$scope.mallDetail.skuPropertyList.length;i++){
            var sku = $scope.mallDetail.skuPropertyList[i];
            var count = Math.ceil(sku.eleList.length / 3);
            $("#skuEle"+ i).css({"padding-top" : 0, "height" : (count * 65) +"px"})
            for (var j = 0; j<sku.eleList.length;j++){
                var ele = sku.eleList[j];
                if (j%3 == 0){
                    $("#"+sku.id+""+j).removeClass().addClass("weui_sku_spanFirst");
                }
            }
        }

        // 图片自动轮播
        $('#slide2').swipeSlide({
            autoSwipe:true,//自动切换默认是
            speed:3000,//速度默认4000
            continuousScroll:true,//默认否
            transitionType:'cubic-bezier(0.22, 0.69, 0.72, 0.88)',//过渡动画linear/ease/ease-in/ease-out/ease-in-out/cubic-bezier
            lazyLoad:true,//懒加载默认否
            firstCallback : function(i,sum,me){
                me.find('.dot').children().first().addClass('cur');
            },
            callback : function(i,sum,me){
                me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
            }
        });
    },10);

    var gallery = $("#gallery"),galleryImg = $("#galleryImg");
    $scope.preview = function (index) {
        galleryImg.attr("style", "background-image:url(" + $("#img"+index).attr("src") + ")");
        gallery.fadeIn(100);
    };
    gallery.on("click", function(){
        gallery.fadeOut(100);
    });



    var skuResultList = [];
    var attResultList = [];
    var totalPrice = 0;
    var attPrice = [];
    var skuPrice = [];
    var skuFlag = false;
    // 选择商品
    $scope.selectMall = function ($event,ele,type) {
        // 改变选中状态
        $($event.target).addClass("weui_sku_spanActive");
        $($event.target).siblings("div").each(function () {
            $(this).removeClass("weui_sku_spanActive");
        });
        var priceArr = [];
        // 遍历当前skuPropertyList
        if (type == 'attachment'){
            var attSelected = [];
            // 遍历配套,改变selected字段值
            for (k in $scope.mallDetail.attachment.list){
                for (i in $scope.mallDetail.attachment.list[k].skuPropertyList){
                    var id = $scope.mallDetail.attachment.list[k].skuPropertyList[i].id;
                    if (ele.pid == id){
                        for (j in $scope.mallDetail.attachment.list[k].skuPropertyList[i].eleList){
                            var aId = $scope.mallDetail.attachment.list[k].skuPropertyList[i].eleList[j].id;
                            if (aId == ele.id){
                                $scope.mallDetail.attachment.list[k].skuPropertyList[i].eleList[j].isSelected = 1;
                            } else {
                                $scope.mallDetail.attachment.list[k].skuPropertyList[i].eleList[j].isSelected = 0;
                            }
                        }
                        break;
                    }
                }
            }

            // 取出所有的select ele
            for (k in $scope.mallDetail.attachment.list){
                for (i in $scope.mallDetail.attachment.list[k].skuPropertyList){
                    for (j in $scope.mallDetail.attachment.list[k].skuPropertyList[i].eleList){
                        var temEle = $scope.mallDetail.attachment.list[k].skuPropertyList[i].eleList[j];
                        if (temEle.isSelected == 1){
                            attSelected.push(temEle.skuList);
                        }
                    }
                }
            }
            if (attSelected.length > 0){
                if (attSelected.length>1){
                    var tempList = attSelected[0];
                    attSelected = attSelected.splice(1,attSelected.length-1);
                    for (i in tempList){
                        var skuId = tempList[i];
                        for (j in attSelected){
                            for (k in attSelected[j]){
                                var tempSkuId = attSelected[j][k];
                                if (skuId == tempSkuId){
                                    attResultList = [];
                                    attResultList.push(skuId);
                                }
                            }
                        }
                    }
                    if (attResultList.length>0){
                        for (i in attResultList){
                            var skuId = attResultList[i];
                            for (k in $scope.mallDetail.attachment.list){
                                for (j in $scope.mallDetail.attachment.list[k].skuList){
                                    var tempSkuId = $scope.mallDetail.attachment.list[k].skuList[j].skuId;
                                    var price = $scope.mallDetail.attachment.list[k].skuList[j].price;
                                    if (skuId == tempSkuId){
                                        if(attPrice.length>0){
                                            totalPrice = totalPrice - attPrice[attPrice.length-1];
                                            attPrice = attPrice.splice(attPrice.length-2,attPrice.length-1);
                                        }
                                        attPrice.push(price);
                                        totalPrice+=attPrice[attPrice.length-1];
                                        break;
                                    }
                                }
                            }
                        }
                        $("#mallPrice").html("￥"+totalPrice);
                    }
                } else if (attSelected.length == 1){
                    for (i in attSelected[0]){
                        var skuId = attSelected[0][i];
                        for (k in $scope.mallDetail.attachment.list){
                            for (j in $scope.mallDetail.attachment.list[k].skuList){
                                var tempSkuId = $scope.mallDetail.attachment.list[k].skuList[j].skuId;
                                var price = $scope.mallDetail.attachment.list[k].skuList[j].price;
                                if (skuId == tempSkuId){
                                    priceArr.push(price);
                                    if(attPrice.length>0){
                                        totalPrice = totalPrice - attPrice[attPrice.length-1];
                                        attPrice = attPrice.splice(attPrice.length-2,attPrice.length-1);
                                    }
                                    attPrice.push(price);
                                    totalPrice+=attPrice[attPrice.length-1];
                                    $("#att"+$scope.mallDetail.attachment.list[k].goodsId).html('￥'+attPrice[attPrice.length-1]);
                                    break;
                                }
                            }
                        }
                    }
                    if (priceArr.length>1){
                        $("#mallPrice").html("￥"+priceArr.sort(compare)[0] + "～"+ priceArr.sort(compare)[priceArr.length-1]);
                    } else if (priceArr.length == 1) {
                        if(attPrice.length>0){
                            totalPrice = totalPrice - attPrice[attPrice.length-1];
                            attPrice = attPrice.splice(attPrice.length-2,attPrice.length-1);
                        }
                        attPrice.push(priceArr[0]);
                        totalPrice+=attPrice[attPrice.length-1];
                        $("#mallPrice").html("￥"+totalPrice);
                    }
                }
            }
        } else {
            var eleSelected=[];
            // 遍历主商品,改变selected字段值
            for (i in $scope.mallDetail.skuPropertyList){
                var id = $scope.mallDetail.skuPropertyList[i].id;
                if (ele.pid == id){
                    for (j in $scope.mallDetail.skuPropertyList[i].eleList){
                        var sId = $scope.mallDetail.skuPropertyList[i].eleList[j].id;
                        if (sId == ele.id){
                            $scope.mallDetail.skuPropertyList[i].eleList[j].isSelected = 1;
                        } else {
                            $scope.mallDetail.skuPropertyList[i].eleList[j].isSelected = 0;
                        }
                    }
                    break;
                }
            }
            // 取出所有的select ele
            for (i in $scope.mallDetail.skuPropertyList){
                for (j in $scope.mallDetail.skuPropertyList[i].eleList){
                    var tempEle = $scope.mallDetail.skuPropertyList[i].eleList[j];
                    if (tempEle.isSelected == 1){
                        eleSelected.push(tempEle.skuList);
                    }
                }
            }
            // 找出skuId
            if (eleSelected.length > 0){
                if (eleSelected.length>1){
                    var tempList = eleSelected[0];
                    eleSelected = eleSelected.splice(1,eleSelected.length-1);
                    for (i in tempList){
                        var skuId = tempList[i];
                        for (j in eleSelected){
                            for (k in eleSelected[j]){
                                var tempSkuId = eleSelected[j][k];
                                if (skuId == tempSkuId){
                                    skuResultList = [];
                                    skuResultList.push(skuId);
                                }
                            }
                        }
                    }
                    if (skuResultList.length>0){
                        skuFlag = true;
                        for (i in skuResultList){
                            var skuId = skuResultList[i];
                            for (j in $scope.skuList){
                                var tempSkuId = $scope.skuList[j].skuId;
                                var price = $scope.skuList[j].price;
                                if (skuId == tempSkuId){
                                    if (skuPrice.length>0){
                                        totalPrice = totalPrice - skuPrice[skuPrice.length-1];
                                        skuPrice = skuPrice.splice(skuPrice.length-2,skuPrice.length-1);
                                    }
                                    skuPrice.push(price);
                                    totalPrice+=skuPrice[skuPrice.length-1];
                                    break;
                                }
                            }
                        }
                        $("#mallPrice").html("￥"+totalPrice);
                    }
                } else if (eleSelected.length == 1){
                    for (i in eleSelected[0]){
                        if (eleSelected[0].length == 1){
                            skuResultList = [];
                            skuResultList.push(eleSelected[0]);
                            skuFlag = true;
                        }
                        var skuId = eleSelected[0][i];
                        for (j in $scope.skuList){
                            var tempSkuId = $scope.skuList[j].skuId;
                            var price = $scope.skuList[j].price;
                            if (skuId == tempSkuId){
                                priceArr.push(price);
                                break;
                            }
                        }
                    }
                    if (priceArr.length>1){
                        $("#mallPrice").html("￥"+priceArr.sort(compare)[0] + "～"+ priceArr.sort(compare)[priceArr.length-1]);
                    } else if (priceArr.length == 1) {
                        if(skuPrice.length>0){
                            totalPrice = totalPrice - skuPrice[skuPrice.length-1];
                            skuPrice = skuPrice.splice(skuPrice.length-2,skuPrice.length-1);
                        }
                        skuPrice.push(priceArr[0]);
                        totalPrice+=skuPrice[skuPrice.length-1];
                        $("#mallPrice").html("￥"+totalPrice);
                    }
                }
            }
        }

    };

    // 比较大小
    var compare = function (x, y) {//比较函数
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    };

    // 购买页
    $scope.toPayMoment = function (title,mainPic) {
        if (!skuFlag){
            $.alert("请选择主商品");
            return;
        }
        $state.go("payMoment",{title:title,month:3,price:totalPrice,mainPic:mainPic,type:$rootScope.type})
    }
});
