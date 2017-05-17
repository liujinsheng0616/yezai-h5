// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var goceanApp = angular.module('starter', ['ui.router','angularFileUpload', 'LocalStorageModule'])

    .run(function () {

    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('hello', {
                cache:false,
                url: '/hello/:name',
                templateUrl: 'templates/hello.html',
                controller: 'HelloCtrl'
            })
            .state('main', {
                cache:false,
                url: '/main',
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl'
            })
            .state('main.home', {
                cache:false,
                url: '/home',
                templateUrl: 'templates/main_home.html',
                controller: 'MainHomeCtrl'
            })
            .state('main.mall', {
                cache:false,
                url: '/mall',
                templateUrl: 'templates/main_mall.html',
                controller: 'MainMallCtrl'
            })
            .state('main.mine', {
                cache:false,
                url: '/mine',
                templateUrl: 'templates/main_mine.html',
                controller: 'MainMineCtrl'
            })
            .state('order', {
                cache:false,
                url: '/order',
                templateUrl: 'templates/order.html',
                controller: 'OrderCtrl'
            })
            .state('order.orderList', {
                cache:false,
                url: '/orderList',
                templateUrl: 'templates/order_orderList.html',
                controller: 'OrderListCtrl'
            })
            .state('orderDetail', {
                cache:false,
                params:{orderId: 0},
                url: '/orderDetail/:orderId',
                templateUrl: 'templates/orderDetail.html',
                controller: 'OrderDetailCtrl'
            })
            .state('orderPay', {
                cache:false,
                params:{orderId: 0},
                url: '/orderPay/:orderId',
                templateUrl: 'templates/orderPay.html',
                controller: 'OrderPayCtrl'
            })
            .state('qiusongPrepay', {
                cache:false,
                params:{qiusongId: 0,memberId:0},
                url: '/qiusongPrepay/:qiusongId/:memberId',
                templateUrl: 'templates/qiusongPrepay.html',
                controller: 'QiusongPrepayPayCtrl'
            })
            .state('qiusongPay', {
                cache:false,
                params:{qiusongId: 0,memberId:0},
                url: '/qiusongPay/:qiusongId/:memberId',
                templateUrl: 'templates/qiusongPay.html',
                controller: 'QiusongPayPayCtrl'
            })
            .state('order.qiusong', {
                cache:false,
                url: '/qiusong',
                templateUrl: 'templates/order_qiusongList.html',
                controller: 'OrderQiusongCtrl'
            })
            .state('about', {
                cache:false,
                url: '/about',
                templateUrl: 'templates/about.html',
                controller: 'AboutCtrl'
            })
            .state('address', {
                cache:false,
                url: '/address',
                templateUrl: 'templates/address.html',
                controller: 'AddressCtrl'
            })
            .state('payment', {
                cache:false,
                params : {
                    'goodsId':0,
                    'skuId':0,
                    'title' : null,
                	'payDescription' : null, 
                	'price' : null,
                	'thumbnail':null,
                    'type':null,
                	'payAttachment':null,
                    'sharerId':0
                	},
                url: '/payment',
                templateUrl: 'templates/payMoment.html',
                controller: 'PayMomentCtrl'
            })
            .state('qiusongEntry', {
                cache:false,
                params : {
                    itemId:0,
                    sharerId:0
                },
                url: '/qiusongEntry/:itemId/:sharerId',
                templateUrl: 'templates/qiusongEntry.html',
                controller: 'QiusongEntryCtrl'
            })
            .state('inServiceDetail', {
                cache:false,
                url: '/inServiceDetail/:orderId',
                params : {orderId: 0},
                templateUrl: 'templates/inServiceDetail.html',
                controller: 'InServiceDetailCtrl'
            })
            .state('changeDeliverDay', {
                cache:false,
                params : {'forward':null,'deliveryDayDtoList':null},
                url: '/changeDeliverDay',
                templateUrl: 'templates/changeDeliveryDay.html',
                controller: 'ChangeDeliverDayCtrl'
            })
            .state('deliveryDetail',{
                cache:false,
                params : {orderId:0},
                url: '/deliveryDetail/:orderId',
                templateUrl: 'templates/deliveryDetail.html',
                controller: 'DeliverDetailCtrl'
            })
            .state('itemDetail', {
                cache:false,
                url: '/itemDetail/:goodsId/:sharerIdStr',
                // params : {'goodsId': null},
                params:{goodsId:0, sharerIdStr:null},
                templateUrl: 'templates/itemDetail.html',
                controller: 'ItemDetailCtrl'
            })
            .state('itemShared', {
                cache:false,
                url: '/itemShared/:goodsId/:sharerIdStr',
                // params : {'goodsId': null},
                params:{goodsId:0, sharerIdStr:null},
                templateUrl: 'templates/itemShared.html',
                controller: 'ItemSharedCtrl'
            })
            .state('normalDetail', {
                cache:false,
                url: '/normalDetail/:orderId',
                params : {orderId: 0},
                templateUrl: 'templates/normalOrderDetail.html',
                controller: 'NormalOrderDetailCtrl'
            })
	        .state('publish', {
                cache:false,
		        params : {'tagList':null},
                url: '/publish',
                templateUrl: 'templates/mall_home_publish.html',
                controller: 'MainHomePublishCtrl'
             })
            .state('qiusongDetailsSponsor', {
                cache:false,
                params : {'id':0},
                url: '/qiusongDetailsSponsor/:id',
                templateUrl: 'templates/qiusongDetails_Sponsor.html',
                controller: 'QiusongDetailsSponsorCtrl'
            })
            .state ('qiusongShared', {
                cache : false,
                url : '/qiusongShared/:sponsorId',
                params : {'sponsorId':0},
                templateUrl : 'templates/qiusongShared.html',
                controller : 'QiusongSharedCtrl'
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/main/home');
    });
