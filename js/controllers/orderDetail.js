/**
 * Created by kingson·liu on 2017/3/11.
 */
goceanApp.controller('OrderDetailCtrl', function ($scope, $rootScope, $state, $timeout, $stateParams, orderDetailService) {
    console.log("about OrderDetailCtrl");

    /*
     private String pr;
     private long createtTime;
     private String status;
     private String type;
     private long sales;
     private OrderAddress address;
     private List<Item> itemList = new ArrayList<Item>();
     */
    /*
     private int quantity;
     private long price;
     private long pricePlus;
     private long bonus;
     private long subsidy;
     private long freight;

     private long sellerId;
     private String type;
     private String title;
     private String payDescription;
     private String thumbnail;

     */

    if ($stateParams.orderDetailsDto != null) {
        $scope.orderDetailsView = $stateParams.orderDetailsDto;
    }else{
        /*
         * 重新请求/ url 带参数
         */
    }

});