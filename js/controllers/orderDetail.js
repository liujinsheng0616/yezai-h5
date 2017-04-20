/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.controller('OrderDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, orderDetailService) {
    console.log("about OrderDetailCtrl");

    var obj = {viewId : 1};
    if ($rootScope.orderDetailsView){
        $scope.orderDetailsView = $rootScope.orderDetailsView;
    } else {
        $scope.orderDetailsView = store.orderForwardDetailsView;
        orderDetailService.getOrderDetail(obj).then(function(data){
            console.log(data);
        },function(err){

        });
    }

});