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
                params:{orderDetailsDto: null},
                url: '/orderDetail',
                templateUrl: 'templates/orderDetail.html',
                controller: 'OrderDetailCtrl'
            })
            .state('order.tuan', {
                cache:false,
                url: '/tuan',
                templateUrl: 'templates/order_tuan.html',
                controller: 'OrderTuanCtrl'
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
                    'goodsId':0,'skuId':0,
                    'title' : null,
                	'payDescription' : null, 
                	'price' : null,
                	'thumbnail':null,'type':null,
                	'payAttachment':null
                	},
                url: '/payment',
                templateUrl: 'templates/payMoment.html',
                controller: 'PayMomentCtrl'
            })
            .state('inServiceDetail', {
                cache:false,
                url: '/inServiceDetail',
                params : {'status' : null},
                templateUrl: 'templates/inServiceDetail.html',
                controller: 'InServiceDetailCtrl'
            })
            .state('changeDeliverDay', {
                cache:false,
                params : {'orderId':null},
                url: '/changeDeliverDay',
                templateUrl: 'templates/changeDeliveryDay.html',
                controller: 'ChangeDeliverDayCtrl'
            })
            .state('deliveryDetail',{
                cache:false,
                params : {'orderId':null,'forwardId':null,'status':null},
                url: '/deliveryDetail',
                templateUrl: 'templates/deliveryDetail.html',
                controller: 'DeliverDetailCtrl'
            })
            .state('itemDetail', {
                cache:false,
                url: '/itemDetail',
                // params : {'goodsId': null},
                params:{'itemDetail':null},
                templateUrl: 'templates/itemDetail.html',
                controller: 'ItemDetailCtrl'
            })
            .state('normalDetail', {
                cache:false,
                url: '/normalDetail',
                templateUrl: 'templates/normalOrderDetail.html',
                controller: 'NormalOrderDetailCtrl'
            })
	    .state('publish', {
                cache:false,
		params : {'tagList':null},
                url: '/publish',
                templateUrl: 'templates/mall_home_publish.html',
                controller: 'MainHomePublishCtrl'
             });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/main/home');
    });
