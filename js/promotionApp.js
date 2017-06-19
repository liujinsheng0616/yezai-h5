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


            .state('qiusongDetails', {
                cache:false,
                params : {'id':0},
                url: '/qiusongDetails/:id',
                templateUrl: 'templates/qiusongDetails.html',
                controller: 'QiusongDetailsSponsorCtrl'
            })
            .state ('qiusongShared', {
                cache : false,
                url : '/qiusongShared/:id/:sharerId',
                params :
                    {id:0,
                    sharerId:0},
                templateUrl : 'templates/qiusongShared.html',
                controller : 'QiusongSharedCtrl'
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('qiusongDetails');
    });
